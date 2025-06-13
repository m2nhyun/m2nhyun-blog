export interface GuestbookEntry {
    id: string;
    name: string;
    message: string;
    email?: string;
    avatar?: string;
    website?: string;
    ipAddress?: string;
    userAgent?: string;
    approved: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface GuestbookEntryCreateData {
    name: string;
    message: string;
    email?: string;
    website?: string;
}

export interface GuestbookEntryUpdateData
    extends Partial<GuestbookEntryCreateData> {
    id: string;
    approved?: boolean;
}
