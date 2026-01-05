import api from "./axiosConfig";
import type { ChatMessage, ChatSession } from "../types/chat";

export const chatService = {
  createSession: async (title: string): Promise<ChatSession> => {
    const response = await api.post<ChatSession>("/chat/sessions", { title });
    return response.data;
  },
  getSessions: async (): Promise<ChatSession[]> => {
    const response = await api.get<ChatSession[]>("/chat/sessions");
    return response.data;
  },
  getMessagesBySession: async (sessionId: number): Promise<ChatMessage[]> => {
    const response = await api.get<ChatMessage[]>(`/chat/sessions/${sessionId}`);
    return response.data;
  },
  streamMessage: async (
    sessionId: number,
    prompt: string,
    onChunk: (chunk: string) => void,
    onWidget: (widgetData: any) => void
  ) => {
    const token = localStorage.getItem("token");

    const response = await fetch(`/api/chat/sessions/${sessionId}/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gắn token thủ công vì fetch ko dùng interceptor của axios
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.body) throw new Error("No stream body");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.replace('data: ', '').trim();
        if (jsonStr === '[DONE]') return;

        try {
          const chunk = JSON.parse(jsonStr);
          if (chunk.type === 'Text') onChunk(chunk.content);
          else if (chunk.type === 'UI') onWidget(chunk.data);
        } catch (e) { /* ignore parse error */ }
      }
    }
  }
};
