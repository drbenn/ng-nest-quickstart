import { Inject, Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL + '/chat',
    methods: ['GET', 'POST'],
    credentials: true,
    // port: 5000000,          // Use TBD
    // namespace: 'chat'       // Use TBD
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {}

  // --- Lifecycle Hooks ---
  
  afterInit(server: Server) {
    this.logger.log('warn', `WebSocket Gateway Initialized`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log('warn', `Client connected: ${client.id}`);
    // You could potentially add all new connections to the public room here
    client.join('public-room');
    this.logger.log('warn', `Client ${client.id} joined room: public-room`);

    // Optional: Notify others someone joined (in the public room)
    // this.server.to('public-room').emit('userJoined', `User ${client.id} joined`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('warn', `Client disconnected: ${client.id}`);
    // Optional: Notify others someone left
    // You might need to track which rooms the client was in to notify correctly
    // this.server.to('public-room').emit('userLeft', `User ${client.id} left`);
    // We'll handle more complex room cleanup later
  }

  // --- Event Handlers ---

  /**
   * Handles incoming messages intended for the public room.
   * @param client The socket instance of the sender.
   * @param payload The data sent by the client (expected to be a string message).
   */
  @SubscribeMessage('sendMessagePublic')
  handleMessagePublic(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { message: string; sender?: string } // Add sender info
  ): void {
    this.logger.log('warn', `Message from ${client.id} (public): ${payload.message}`);
    // Broadcast the message to EVERYONE in the 'public-room'
    this.server.to('public-room').emit('newMessagePublic', {
        ...payload,
        senderId: client.id, // Add sender's socket ID
        timestamp: new Date()
    });
  }

  /**
   * Handles joining a specific private/group room.
   * @param client The socket instance of the sender.
   * @param roomName The name of the room to join.
   */
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: string,
  ): void {
    client.join(roomName);
    this.logger.log('warn', `Client ${client.id} joined room: ${roomName}`);
    // Optionally notify others in the room (or just the client) that they joined
    client.emit('joinedRoom', roomName); // Notify the client they succeeded
    // this.server.to(roomName).emit('userJoinedRoom', { userId: client.id, roomName }); // Notify others
  }

    /**
   * Handles leaving a specific private/group room.
   * @param client The socket instance of the sender.
   * @param roomName The name of the room to leave.
   */
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomName: string,
  ): void {
    client.leave(roomName);
    this.logger.log('warn', `Client ${client.id} left room: ${roomName}`);
    client.emit('leftRoom', roomName); // Notify the client they left
    // Optionally notify others in the room
    // this.server.to(roomName).emit('userLeftRoom', { userId: client.id, roomName });
  }


  /**
   * Handles incoming messages intended for a specific room.
   * @param client The socket instance of the sender.
   * @param payload Object containing roomName and message.
   */
  @SubscribeMessage('sendMessageToRoom')
  handleMessageToRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { roomName: string; message: string; sender?: string },
  ): void {
    this.logger.log('warn', `Message from ${client.id} to room ${payload.roomName}: ${payload.message}`);
    // Broadcast the message ONLY to clients in the specified room
    // We include the sender so the sender doesn't get their own message broadcast back immediately
    // client.to(payload.roomName).emit('newMessagePrivate', { ... }) // Sends to everyone in room EXCEPT sender
    this.server.to(payload.roomName).emit('newMessagePrivate', { // Sends to everyone in room INCLUDING sender
        ...payload,
        senderId: client.id,
        timestamp: new Date()
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
