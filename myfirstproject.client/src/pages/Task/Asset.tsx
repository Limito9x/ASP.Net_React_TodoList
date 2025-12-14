import {
  Upload,
  message,
  Card,
  Image,
  Button,
  Row,
  Col,
  Spin,
  Empty,
} from "antd";
import {
  DeleteOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  FileOutlined,
  DownloadOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { assetService, type AssetResponse } from "../../services/assetService";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

export default function Asset({ planId }: { planId: string }) {
  const queryClient = useQueryClient();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: assets, isLoading } = useQuery<AssetResponse[]>({
    queryKey: ["assets", planId],
    queryFn: () => assetService.getAsset(planId),
  });

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => assetService.uploadAssets({ files, planId }),
    onSuccess: () => {
      messageApi.success("Uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["assets", planId] });
    },
    onError: () => {
      messageApi.error("Upload failed!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (assetId: string) => assetService.deleteAsset(assetId),
    onSuccess: () => {
      messageApi.success("Asset deleted!");
      queryClient.invalidateQueries({ queryKey: ["assets", planId] });
    },
  });

  const getFileExtension = (url: string) => {
    return url.split(".").pop()?.toLowerCase() || "";
  };

  const getFileName = (url: string) => {
    return url.split("/").pop() || "File";
  };

  const renderAssetCard = (asset: AssetResponse) => {
    const ext = getFileExtension(asset.url);
    const fileName = getFileName(asset.fileName);
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi"];
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];

    const isVideo = videoExtensions.includes(ext);
    const isImage = imageExtensions.includes(ext) || asset.type === "Image";

    return (
      <Col xs={24} sm={12} md={8} lg={6} key={asset.id}>
        <Card
          hoverable
          style={{ height: "100%" }}
          cover={
            <div
              style={{
                height: 200,
                overflow: "hidden",
                background: "#f5f5f5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isImage ? (
                <Image
                  src={asset.url}
                  alt={fileName}
                  height={200}
                  style={{
                    objectFit: "cover",
                    display: "block",
                  }}
                  preview={{
                    mask: (
                      <div style={{ fontSize: 16 }}>
                        <FileImageOutlined /> Preview
                      </div>
                    ),
                  }}
                />
              ) : isVideo ? (
                <video
                  src={asset.url}
                  controls
                  style={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                  }}
                  preload="metadata"
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    fontSize: 48,
                    color: "#bfbfbf",
                  }}
                >
                  <FileOutlined />
                </div>
              )}
            </div>
          }
          actions={[
            <Button
              key="download"
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => window.open(asset.url, "_blank")}
            >
              Download
            </Button>,
            <Button
              key="delete"
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => deleteMutation.mutate(asset.id)}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>,
          ]}
        >
          <Card.Meta
            avatar={
              isImage ? (
                <FileImageOutlined style={{ fontSize: 24, color: "#52c41a" }} />
              ) : isVideo ? (
                <VideoCameraOutlined
                  style={{ fontSize: 24, color: "#1890ff" }}
                />
              ) : (
                <FileOutlined style={{ fontSize: 24, color: "#8c8c8c" }} />
              )
            }
            title={
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
                title={fileName}
              >
                {fileName}
              </div>
            }
            description={
              <span style={{ textTransform: "uppercase", fontSize: 12 }}>
                {ext || "Unknown"} •{" "}
                {isImage ? "Image" : isVideo ? "Video" : "File"}
              </span>
            }
          />
        </Card>
      </Col>
    );
  };

  return (
    <>
      {contextHolder}
      <div style={{ padding: "24px" }}>
        <h1 style={{ marginBottom: 24 }}>My Assets</h1>

        <Upload.Dragger
          multiple
          beforeUpload={(file) => {
            uploadMutation.mutate([file]);
            return false;
          }}
          showUploadList={false}
          style={{ marginBottom: 24 }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag files to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for images, videos, and other files. Multiple uploads
            supported.
          </p>
        </Upload.Dragger>

        {isLoading ? (
          <div style={{ textAlign: "center", padding: 50 }}>
            <Spin size="large" />
          </div>
        ) : assets && assets.length > 0 ? (
          <Row gutter={[16, 16]}>
            {assets.map((asset) => renderAssetCard(asset))}
          </Row>
        ) : (
          <Empty
            description="No assets found. Upload some files to get started!"
            style={{ marginTop: 40 }}
          />
        )}
      </div>
    </>
  );
}
