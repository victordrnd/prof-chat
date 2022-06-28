import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Service } from 'src/utils/services/s3.service';
import { Repository } from 'typeorm';
import { Room } from '../room/entities/room.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class MessageService {

  constructor(@InjectRepository(Message)
  private readonly messageRepository: Repository<Message>,
  @InjectRepository(Room)
  private readonly roomRepository : Repository<Room>,
  private readonly s3Service : S3Service) {}

  
  async create(message: Message) {
    this.roomRepository.update(
      {id : message.roomId},
      {updated_at : new Date()}
    );
    return await this.messageRepository.save(message);
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
