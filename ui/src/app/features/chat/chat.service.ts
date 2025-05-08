import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

export interface ChatMessage {
    message: string;
    sender?: string; // Optional: Display name from user input
    senderId?: string; // Socket ID from backend
    roomName?: string; // For private messages
    timestamp?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  constructor(private socket: Socket) { }

  // --- Sending Messages ---

  sendMessagePublic(message: string, sender?: string): void {
    const payload: ChatMessage = { message, sender };
    console.log('send message to public in service: ', message, sender);
    
    this.socket.emit('sendMessagePublic', payload);
  }

  sendMessageToRoom(roomName: string, message: string, sender?: string): void {
    const payload: ChatMessage = { roomName, message, sender };
    this.socket.emit('sendMessageToRoom', payload);
  }

  // --- Listening for Messages ---

  // Listen for public messages
  listenForMessagesPublic(): Observable<ChatMessage> {
    return this.socket.fromEvent<ChatMessage, 'newMessagePublic'>('newMessagePublic');
  }

   // Listen for private/room messages
  listenForMessagesPrivate(): Observable<ChatMessage> {
    return this.socket.fromEvent<ChatMessage, 'newMessagePrivate'>('newMessagePrivate');
  }

  // --- Room Management ---

  joinRoom(roomName: string): void {
    this.socket.emit('joinRoom', roomName);
  }

  leaveRoom(roomName: string): void {
    this.socket.emit('leaveRoom', roomName);
  }

  // Listen for confirmation/events related to rooms
  listenForJoinedRoom(): Observable<string> {
    return this.socket.fromEvent<string, 'joinedRoom'>('joinedRoom');
  }

  listenForLeftRoom(): Observable<string> {
    return this.socket.fromEvent<string, 'leftRoom'>('leftRoom');
  }

  // Listen for other users joining/leaving (example)
  listenForUserJoinedRoom(): Observable<{ userId: string, roomName: string }> {
      return this.socket.fromEvent<{ userId: string, roomName: string }, 'userJoinedRoom'>('userJoinedRoom');
  }

  listenForUserLeftRoom(): Observable<{ userId: string, roomName: string }> {
      return this.socket.fromEvent<{ userId: string, roomName: string }, 'userLeftRoom'>('userLeftRoom');
  }


  // --- Connection Status ---
  // ngx-socket-io automatically handles reconnects, but you can listen to events

  onConnect(): Observable<void> {
      return this.socket.fromEvent<undefined, 'connect'>('connect');
  }

  onDisconnect(): Observable<void> {
      return this.socket.fromEvent<undefined, 'disconnect'>('disconnect');
  }

  // --- Disconnect Manually (if needed) ---
  disconnect(): void {
      this.socket.disconnect();
  }
}
