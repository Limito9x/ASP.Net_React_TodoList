export interface BaseEntity {
    id: number;
    createdAt: string;
    updatedAt?: string;
}

export interface SimpleBaseEntity {
    id: number;
    createdAt: string;
    updatedAt?: string;
}

export interface TimeLineEntity {
    id: number;
    createdAt: string;
    updatedAt?: string;
    startDate?: string;
    endDate?: string;
    actualStartDate?: string;
    actualEndDate?: string;
}