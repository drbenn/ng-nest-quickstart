export interface MessageDataDto {
  type: string;
  text?: string;
  url?: string;
  fileName?: string;
  caption?: string;
  reactions?: Record<string, string[]>;
  // Optional: Frontend sender name if not linking directly to user table always
  senderName?: string;
}

export interface ChatMessageDbRowDto {
  id: number;
  room_id: number;
  sender_id: string | null;
  created_at: Date;
  message_data: MessageDataDto;
}