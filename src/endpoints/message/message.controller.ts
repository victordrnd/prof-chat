import { Controller, Get, Post, Body, Request, Param, Delete, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Message } from './entities/message.entity';
import { Jwt } from 'src/utils/decorators/jwt';
import { userInfo } from 'os';
import { User } from '../users/entities/user.entity';
import { JwtAuthenticateGuard } from 'src/utils/guards/jwt.authenticate.guard';

@Controller('messages')
@ApiTags('messages')
@UseGuards(JwtAuthenticateGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) { }

  // @Get()
  // findAll() {
  //   return this.messageService.findAll();
  // }


  @Post()
  @ApiParam(CreateMessageDto)
  async create(@Request() req : any, @Body() message: CreateMessageDto) {
    const new_message = new Message();
    new_message.userId = req.user.id;
    new_message.content = message.content
    new_message.type = "text";
    new_message.roomId = message.roomId;
    return await this.messageService.create(new_message);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageService.remove(+id);
  }
}
