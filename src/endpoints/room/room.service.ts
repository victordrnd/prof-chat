import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {

  constructor(@InjectRepository(Room)
  private readonly roomRepository: Repository<Room>) {

  }

  create(createRoomDto: CreateRoomDto) {
    return 'This action adds a new room';
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


  findAll() {
    return this.roomRepository.createQueryBuilder('rooms')
      .innerJoin(
        'rooms.users',
        'user',
        'user.id = :userId',
        { userId: 1 }
      ).getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
