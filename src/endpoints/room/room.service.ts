import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/utils/services/s3.service';
import { ChatService } from 'src/websockets/chat.service';
import { Repository } from 'typeorm';
import { Message } from '../message/entities/message.entity';
import { User } from '../users/entities/user.entity';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {

  constructor(@InjectRepository(Room)
  private readonly roomRepository: Repository<Room>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject('PUBSUB_SERVICE') private clientProxy: ClientProxy,
    private readonly s3Service: S3Service
  ) {

  }

  async create(room: Room) {
    const new_room = await this.roomRepository.save(room);
    this.clientProxy.emit('handleNewRoomEvent', new_room);
    return this.findOne(new_room.id!);
  }


  getAllMessagesInRoom(room_id: number) {
    return this.messageRepository.createQueryBuilder('messages')
      .where('roomId = :room_id', { room_id: room_id })
      .orderBy('created_at', 'ASC')
      .limit(100)
      .getMany();
  }

  async findAll(user_id: number) {
    const rooms = await this.roomRepository.createQueryBuilder('rooms')
      .leftJoin('rooms.users', 'user')
      .leftJoinAndSelect('rooms.users', 'AllOthersusers')
      .where('user.id = :searchQuery', { searchQuery: user_id })
      .where('AllOthersusers.id = :id', { id: user_id })
      .getMany();

    return await Promise.all(rooms.map(async (room) => {
      room.last_message = await this.getLastMessage(room.id!);
      return room;
    }));
  }

  async findOne(id: number) {
    const room = await this.roomRepository.createQueryBuilder('rooms')
      .leftJoinAndSelect('rooms.users', 'AllOthersusers')
      // .leftJoinAndSelect('rooms.messages', 'messages')
      .where('rooms.id = :roomId', { roomId: id })
      .getOne();

    room!.users = room!.users!.map((user: User) => {
      user.avatar = this.s3Service.getObjectUrl(user.avatar!);
      return user;
    });
    room!.last_message = await this.getLastMessage(id);
    return room;
  }


  getLastMessage(room_id: number) {
    return this.messageRepository.createQueryBuilder('messages')
      .where('roomId = :room_id', { room_id })
      .orderBy('created_at', 'ASC')
      .getOne();
  }
  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
