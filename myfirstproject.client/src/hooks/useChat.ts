import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { chatService } from "../services/chatService";

export const useChat = (sessionId: number) => {
  const queryClient = useQueryClient();
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  // 1. Lấy lịch sử bằng TanStack Query (Dùng axios qua service)
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["chat", sessionId],
    queryFn: () => chatService.getMessagesBySession(sessionId),
  });

  // 2. Hàm gửi tin nhắn (Stream)
  const sendMessage = async (message: string) => {
    setIsStreaming(true);
    setStreamingText("");

    // Optimistic Update: Thêm tin nhắn user vào cache ngay lập tức
    queryClient.setQueryData(["chat", sessionId], (old: any[] = []) => [
      ...old,
      { id: Date.now(), role: "user", content: message },
    ]);

    try {
      await chatService.streamMessage(
        sessionId,
        message,
        (text) => setStreamingText((prev) => prev + text), // Cập nhật text liên tục
        (widgetData) => {
          // Khi nhận Widget, add thẳng vào cache của TanStack Query
          queryClient.setQueryData(["chat", sessionId], (old: any[] = []) => [
            ...old,
            { role: "assistant", content: "", data: { payload: widgetData } }, // Mock structure
          ]);
        }
      );

      // Sau khi stream xong, invalidate để load lại data chuẩn từ DB (để đồng bộ ID, v.v.)
      queryClient.invalidateQueries({ queryKey: ["chat", sessionId] });
    } catch (error) {
      console.error(error);
    } finally {
      setIsStreaming(false);
      setStreamingText("");
    }
  };

  return { history, isLoading, sendMessage, streamingText, isStreaming };
};
