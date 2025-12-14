import api from "./axiosConfig";

export const FileType = {
  IMAGE: "Image",
  VIDEO: "Video",
  DOCUMENT: "Document",
} as const;
export type FileType = (typeof FileType)[keyof typeof FileType];

export interface AssetPayload {
  files: File[];
  planId: string;
  taskId?: string;
}

export interface AssetResponse {
  id: string;
  url: string;
  publicId: string;
  fileName: string;
  createdAt: string;
  type: FileType;
}

export const assetService = {
  getAsset: async (planId: string) => {
    const response = await api.get<AssetResponse[]>(`/assets`, {
      params: { planId },
    });
    return response.data;
  },

  uploadAssets: async (payload: AssetPayload) => {
    const formData = new FormData();
    payload.files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("planId", payload.planId);
    if (payload.taskId) {
      formData.append("taskId", payload.taskId);
    }
    return await api.post<AssetResponse[]>(`/assets`, formData);
  },

  deleteAsset: async (assetId: string) => {
    return await api.delete(`/assets/${assetId}`);
  },
};
