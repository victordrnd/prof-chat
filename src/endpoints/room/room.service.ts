import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { cp } from 'fs';
import { Server } from 'socket.io';
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
    private readonly s3Service: S3Service
  ) {

  }

  async create(room: Room) {
    const new_room = await this.roomRepository.save(room);
    return this.findOne(new_room.id!);
  }


  async getAllMessagesInRoom(room_id: number) {
    let messages = await this.messageRepository.createQueryBuilder('messages')
      .where('roomId = :room_id', { room_id: room_id })
      .orderBy('created_at', 'DESC')
      .limit(100)
      .getMany();

    messages = messages.sort((a, b) => a.id! - b.id!)

    return await Promise.all(messages.map(async (message) => {
      if (message.type != "text") {
        message.content = await this.s3Service.getObjectUrl(message.content!)
      }
      return message;
    }));
  }

  async findAll(user_id: number) {
    const rooms = await this.roomRepository.createQueryBuilder('rooms')
      .leftJoin('rooms.users', 'user')
      .leftJoinAndSelect('rooms.users', 'AllOthersusers')
      .where('user.id = :searchQuery', { searchQuery: user_id })
      .orderBy('rooms.updated_at', 'DESC')
      .getMany();

    return await Promise.all(rooms.map(async (room) => {
      const teacher = room.users?.find(user=>user.role_id == 2);
      if(teacher){
        if(teacher.avatar){
          room.image = await this.s3Service.getObjectUrl(teacher.avatar);
        }
      }
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
    if (room!.users) {
      room!.users =  await Promise.all(room!.users.map(async (user) => {
        user.avatar = await this.s3Service.getObjectUrl(user.avatar!);
        return user;
      }));
    }
    room!.last_message = await this.getLastMessage(id);
    return room;
  }


  async getLastMessage(room_id: number) {
    const message = await this.messageRepository.createQueryBuilder('messages')
      .where('roomId = :room_id', { room_id })
      .orderBy('created_at', 'DESC')
      .getOne();
    if (message) {
      if (message!.type != "text") {
        message!.content = "New attachment file"
      }
    }
    return message
  }
  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
