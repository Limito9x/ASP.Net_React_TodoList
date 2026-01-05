import { Bubble, Sender } from "@ant-design/x";
import { Button, Form, Input, Modal, Select, message } from "antd";
import { useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import { useChat } from "../hooks/useChat";
import { PlanWidget } from "../components/Widget/PlanWidget";
import { UserOutlined, RobotOutlined, PlusOutlined } from "@ant-design/icons";

// Hàm tiện ích để parse JSON an toàn (tránh crash app)
const safeParseJSON = (data: any) => {
  if (!data) return null;
  if (typeof data === "object") return data; // Nếu đã là object thì trả về luôn
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to parse widget data:", e);
    return null;
  }
};

export default function AIChat() {
  const [modal, setModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // 1. Lấy danh sách Session
  const { data: sessionList, isLoading: isLoadingSessions } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: async () => chatService.getSessions(),
  });

  // Tự động chọn session đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!selectedSession && sessionList && sessionList.length > 0) {
      setSelectedSession(sessionList[0].id);
    }
  }, [sessionList, selectedSession]);

  // 2. Hook Chat (Logic chính)
  const { history, sendMessage, streamingText, isStreaming } = useChat(
    selectedSession || 0
  );

  // 3. Tạo Session mới
  const createSessionMutation = useMutation({
    mutationFn: (title: string) => chatService.createSession(title),
    onSuccess: (newSession: any) => {
      // Refresh list
      queryClient.invalidateQueries({ queryKey: ["chatSessions"] });
      setModal(false);
      form.resetFields();
      message.success("Đã tạo đoạn chat mới");

      // Tự động chuyển sang session mới tạo (nếu API trả về object session)
      if (newSession && newSession.id) {
        setSelectedSession(newSession.id);
      }
    },
  });

  // 4. Chuẩn bị dữ liệu hiển thị (Memoize để tránh tính toán lại dư thừa)
  const bubbleItems = useMemo(() => {
    // Map lịch sử chat cũ
    const items = history.map((msg: any) => {
      const isUser = msg.role === "user";
      const widgetData = msg.type === "UI" ? safeParseJSON(msg.data) : null;

      return {
        key: msg.id.toString(),
        placement: isUser ? "end" : "start",
        avatar: isUser ? (
          <UserOutlined />
        ) : (
          <RobotOutlined style={{ color: "#1677ff" }} />
        ),
        content: msg.content,
        // Hiển thị Widget nếu có data hợp lệ
        footer: widgetData ? <PlanWidget data={widgetData} /> : null,
      };
    });

    // Thêm tin nhắn đang stream (nếu có)
    if (isStreaming) {
      items.push({
        key: "streaming-bubble",
        placement: "start",
        avatar: <RobotOutlined style={{ color: "#1677ff" }} />,
        content: streamingText,
        loading: streamingText.length === 0, // Hiện 3 chấm khi chưa có chữ
        typing: { step: 5, interval: 20 }, // Hiệu ứng gõ chữ
      });
    }

    return items;
  }, [history, isStreaming, streamingText]);

  // Handle Submit
  const handleSubmit = (value: string) => {
    if (!value.trim()) return;
    sendMessage(value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh", // Quan trọng: Chiếm toàn bộ chiều cao màn hình
        background: "#f5f5f5",
      }}
    >
      {/* --- HEADER (Chọn Session & Nút tạo mới) --- */}
      <div
        style={{
          padding: "16px 20px",
          background: "#fff",
          borderBottom: "1px solid #f0f0f0",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <Select
          style={{ flex: 1, maxWidth: 300 }}
          value={selectedSession}
          onChange={setSelectedSession}
          placeholder="Chọn cuộc hội thoại..."
          loading={isLoadingSessions}
          options={sessionList?.map((s: any) => ({
            label: s.title,
            value: s.id,
          }))}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setModal(true)}
        >
          Mới
        </Button>
      </div>

      {/* --- CHAT AREA (Cuộn độc lập) --- */}
      <div
        style={{
          flex: 1,
          overflowY: "auto", // Chỉ cuộn vùng này
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {selectedSession ? (
          <Bubble.List
            items={bubbleItems}
            autoScroll // Ant Design X hỗ trợ tự cuộn xuống cuối
          />
        ) : (
          <div style={{ textAlign: "center", marginTop: 50, color: "#999" }}>
            <RobotOutlined style={{ fontSize: 40, marginBottom: 10 }} />
            <p>Vui lòng chọn hoặc tạo cuộc hội thoại mới</p>
          </div>
        )}
      </div>

      {/* --- SENDER AREA (Cố định dưới đáy) --- */}
      <div
        style={{
          background: "#fff",
          padding: "16px 20px",
          borderTop: "1px solid #f0f0f0",
        }}
      >
        <Sender
          loading={isStreaming} // Disable nút gửi khi đang nhận phản hồi
          onSubmit={handleSubmit}
          placeholder="Nhập yêu cầu của bạn..."
          disabled={!selectedSession} // Khóa nếu chưa chọn session
        />
      </div>

      {/* --- MODAL TẠO SESSION --- */}
      <Modal
        title="Tạo cuộc hội thoại mới"
        open={modal}
        onCancel={() => setModal(false)}
        confirmLoading={createSessionMutation.isPending}
        onOk={() => {
          form.validateFields().then((values) => {
            createSessionMutation.mutate(values.title);
          });
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="Tên cuộc hội thoại"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input placeholder="Ví dụ: Kế hoạch đi Nhật..." autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
