import type { BaseEntity, SimpleBaseEntity } from "./common"

export interface ChatSession extends BaseEntity{
    title: string;
}

export interface ChatMessage extends SimpleBaseEntity {
    key: string;
    type: "Text" | "UI";
    content: string;
    data?: any;
    sessionId?: number;
    role: "user" | "assistant";
}