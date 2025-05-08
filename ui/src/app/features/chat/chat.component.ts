import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatService } from './chat.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimize change detection
})
export class ChatComponent {
  private chatService = inject(ChatService);
  private cdRef = inject(ChangeDetectorRef); // Inject ChangeDetectorRef

  // Component State
  messages: ChatMessage[] = [];
  newMessage: string = '';
  senderName: string = ''; // Optional: User's display name
  currentRoom: string | null = 'public-room'; // Start in public room
  roomInput: string = ''; // For joining specific rooms

  // Subscriptions
  private messageSubPublic: Subscription | null = null;
  private messageSubPrivate: Subscription | null = null;
  private joinedRoomSub: Subscription | null = null;
  private leftRoomSub: Subscription | null = null;
  // Add subs for other events if needed

  ngOnInit(): void {
    // Automatically join public room on init (handled server-side on connect now)
    // this.chatService.joinRoom('public-room'); // Explicit join might still be useful

    this.listenForMessages();
    this.listenForRoomEvents();

     // Optional: Listen for connect/disconnect events for UI feedback
    this.chatService.onConnect().subscribe(() => {
      console.log('Connected to WebSocket server');
        // Re-join room if needed after reconnect
      if(this.currentRoom) {
        this.chatService.joinRoom(this.currentRoom);
      }
      this.cdRef.markForCheck();
    });

    this.chatService.onDisconnect().subscribe(() => {
      console.log('Disconnected from WebSocket server');
      this.cdRef.markForCheck();
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    this.messageSubPublic?.unsubscribe();
    this.messageSubPrivate?.unsubscribe();
    this.joinedRoomSub?.unsubscribe();
    this.leftRoomSub?.unsubscribe();

    // Optionally leave the current room when component is destroyed
    if (this.currentRoom) {
      this.chatService.leaveRoom(this.currentRoom);
    }
    // Optionally disconnect if this component manages the main connection lifecycle
    // this.chatService.disconnect();
  }

  listenForMessages(): void {
    // Listen for public messages
    this.messageSubPublic = this.chatService.listenForMessagesPublic().subscribe((message: ChatMessage) => {
      console.log('Public message received:', message);
      // Only add if we are in the public room OR if it's a global broadcast type
      if (this.currentRoom === 'public-room') {
        this.messages.push(message);
        this.cdRef.markForCheck(); // Trigger change detection
      }
    });

      // Listen for private/room messages
    this.messageSubPrivate = this.chatService.listenForMessagesPrivate().subscribe((message: ChatMessage) => {
      console.log('Private message received:', message);
      // Only add if the message is for the room we are currently in
      if (message.roomName && this.currentRoom === message.roomName) {
        this.messages.push(message);
        this.cdRef.markForCheck(); // Trigger change detection
      }
    });
  }

  listenForRoomEvents(): void {
    this.joinedRoomSub = this.chatService.listenForJoinedRoom().subscribe(roomName => {
      console.log(`Successfully joined room: ${roomName}`);
      // Add UI feedback if needed
      this.messages.push({ message: `You joined room: ${roomName}`, sender: 'System' });
      this.cdRef.markForCheck();
    });

    this.leftRoomSub = this.chatService.listenForLeftRoom().subscribe(roomName => {
      console.log(`Successfully left room: ${roomName}`);
      // Add UI feedback if needed
      this.messages.push({ message: `You left room: ${roomName}`, sender: 'System' });
      this.cdRef.markForCheck();
    });

    // Add listeners for userJoinedRoom, userLeftRoom etc. to update UI
  }

  sendMessage(): void {
    if (this.newMessage.trim() === '') {
      return;
    }

    if (this.currentRoom && this.currentRoom !== 'public-room') {
      // Send to specific room
      this.chatService.sendMessageToRoom(this.currentRoom, this.newMessage, this.senderName || 'Anonymous');
    } else {
      // Send to public room
      this.chatService.sendMessagePublic(this.newMessage, this.senderName || 'Anonymous');
    }

    // Optionally add the message locally immediately for better UX
    // this.messages.push({ message: this.newMessage, sender: this.senderName || 'You', timestamp: new Date() });

    this.newMessage = ''; // Clear input
    // No need for markForCheck here as ngModel handles input clearing
  }

  joinRoom(): void {
    const roomToJoin = this.roomInput.trim();
    if (!roomToJoin) return;

    if (this.currentRoom && this.currentRoom !== roomToJoin) {
      // Leave the current room before joining a new one
      this.chatService.leaveRoom(this.currentRoom);
      this.messages = []; // Clear messages when changing rooms
    }

    this.chatService.joinRoom(roomToJoin);
    this.currentRoom = roomToJoin;
    this.roomInput = ''; // Clear input
    console.log(`Attempting to join room: ${roomToJoin}`);
    // Change detection will be triggered by the 'joinedRoom' event listener
  }

  leaveCurrentRoom(): void {
    if (this.currentRoom && this.currentRoom !== 'public-room') {
      this.chatService.leaveRoom(this.currentRoom);
      this.messages.push({ message: `You left room: ${this.currentRoom}`, sender: 'System' });
      this.currentRoom = 'public-room'; // Revert to public room
      this.messages = []; // Clear messages
      this.chatService.joinRoom('public-room'); // Explicitly join public room again
      this.cdRef.markForCheck();
    } else {
        console.log("Already in or switching to public room.");
      if (this.currentRoom !== 'public-room') {
        this.currentRoom = 'public-room';
        this.messages = []; // Clear messages
        this.chatService.joinRoom('public-room');
        this.cdRef.markForCheck();
      }
    }
  }
}
