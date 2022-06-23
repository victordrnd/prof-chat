import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../message/entities/message.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {

  constructor(@InjectRepository(Room)
  private readonly roomRepository: Repository<Room>,
  @InjectRepository(Message)
  private readonly messageRepository : Repository<Message>) {

  }

  create(room: Room) {
    return this.roomRepository.save(room);
  }


  getAllMessagesInRoom(room_id: number) {
    return this.roomRepository.find({
      relations: ['messages'],
      loadEagerRelations: true,
      where: {
        id: room_id
      }
    });
  }


  findAll(user_id: number) {
    return this.roomRepository.createQueryBuilder('rooms')
    .leftJoin('rooms.users', 'user')
    .leftJoinAndSelect('rooms.users', 'AllOthersusers')
    .where('user.id = :searchQuery', { searchQuery: user_id })
    .getMany();
  }

  findOne(id: number) {
    return this.roomRepository.createQueryBuilder('rooms')
    .leftJoinAndSelect('rooms.users', 'AllOthersusers')
    .leftJoinAndSelect('rooms.messages', 'messages')
    .where('rooms.id = :roomId', {roomId : id})
    .getOne();
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
