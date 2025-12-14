import { Upload, Button, message } from "antd";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import type { UploadFile, UploadProps } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { assetService } from "../services/assetService";

const { Dragger } = Upload;

export default function FileUploader({ planId, taskId, onSuccess }: any) {
  const queryClient = useQueryClient();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const uploadMutation = useMutation({
    mutationFn: (files: any) =>
      assetService.uploadAssets({ files, planId, taskId }),
    onSuccess: () => {
      message.success("Uploaded!");
      setFileList([]); // Xóa list sau khi up xong
      // Partial matching: invalidate tất cả query bắt đầu với ["assets", planId]
      queryClient.invalidateQueries({
        queryKey: ["assets", planId],
        refetchType: "active",
      });
      if (onSuccess) onSuccess();
    },
  });

  const handleUpload = () => {
    uploadMutation.mutate(fileList);
  };

  const props: UploadProps = {
    multiple: true,
    // 'picture': Hiển thị dạng list dọc, có thumbnail nhỏ bên trái (Gọn, đẹp)
    // 'picture-card': Hiển thị dạng ô vuông lưới (Giống FilePond hơn)
    listType: "picture-card",

    fileList: fileList,
    beforeUpload: (file) => {
      const previewUrl = URL.createObjectURL(file);
      (file as UploadFile).thumbUrl = previewUrl;
      setFileList((prev) => [...prev, file]);
      return false;
    },
    onRemove: (file) => {
      setFileList((prev) => prev.filter((item) => item.uid !== file.uid));
    },
  };

  // Khi component bị tắt, xóa các đường dẫn ảo đi cho nhẹ máy
  useEffect(() => {
    return () => {
      fileList.forEach((file) => {
        if (file.thumbUrl) {
          URL.revokeObjectURL(file.thumbUrl);
        }
      });
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Dragger {...props} style={{ marginBottom: 16 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area</p>
      </Dragger>

      {fileList.length > 0 && (
        <Button
          type="primary"
          onClick={handleUpload}
          loading={uploadMutation.isPending}
          icon={<UploadOutlined />}
          style={{ marginTop: 16 }}
        >
          Start Upload
        </Button>
      )}
    </div>
  );
}
