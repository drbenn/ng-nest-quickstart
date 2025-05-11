import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, OnDestroy, OnInit, Output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXCircleSolid, heroPaperAirplaneSolid, heroChevronDownSolid, heroChevronUpSolid } from '@ng-icons/heroicons/solid';
import { Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { ChatMessage, ChatService } from '../chat.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'chat-box',
  imports: [NgIcon, CommonModule, FormsModule],
  templateUrl: './chat-box.component.html',
  styleUrl: './chat-box.component.scss',
  providers: [provideIcons({heroXCircleSolid, heroPaperAirplaneSolid})],
  changeDetection: ChangeDetectionStrategy.OnPush, // Optimize change detection
})
export class ChatBoxComponent implements OnInit, OnDestroy {
  @Output() closeChat = new EventEmitter<void>;
  theme$: Observable<string> = inject(Store).select((state) => state.appState.theme);
  protected closeIcon = heroXCircleSolid;
  protected sendIcon = heroPaperAirplaneSolid;
  protected minimizeIcon = heroChevronDownSolid;
  protected maximizeIcon = heroChevronUpSolid;

  protected isChatMinimized: boolean = false;


  protected minimizeChat(): void {
    this.isChatMinimized = true;
  }

  protected maximizeChat(): void {
    this.isChatMinimized = false;
  }
  



  protected closeChatBox(): void {
    this.closeChat.emit();
  }

  private chatService = inject(ChatService);
  private cdRef = inject(ChangeDetectorRef); // Inject ChangeDetectorRef

  // Subscriptions
  private messageSubPublic: Subscription | null = null;
  private messageSubPrivate: Subscription | null = null;
  private joinedRoomSub: Subscription | null = null;
  private leftRoomSub: Subscription | null = null;

  constructor (
    private store: Store
  ) {}

  ngOnInit(): void {
    const userData = this.store.selectSnapshot((state) => state.authState.getNavUserData)
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

  
  messages: ChatMessage[] = [];
  newMessage: string = '';
  senderName: string = '';
  currentRoom: string | null = 'service room-42';

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
}
