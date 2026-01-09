import { create } from "zustand";

interface PlanModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  editingId?: number; // Lưu ID đang sửa
  initialValues?: any;
  openModal: (mode: "create" | "edit", editingId?: number, initialValues?: any) => void;
  closeModal: () => void;
}

export const usePlanModalStore = create<PlanModalState>((set) => ({
  isOpen: false,
  mode: "create",
  editingId: undefined,
  openModal: (mode, editingId, initialValues) =>
    set(() => ({ isOpen: true, mode, editingId, initialValues })),
  closeModal: () => set(() => ({ isOpen: false, editingId: undefined })),
}));
