import { Controller, Get, Post, Body, Request, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Room } from './entities/room.entity';
import { UsersService } from '../users/user.service';
import { JwtAuthenticateGuard } from 'src/utils/guards/jwt.authenticate.guard';
import { Jwt } from 'src/utils/decorators/jwt';
import { User } from '../users/entities/user.entity';
import { ChatService } from 'src/websockets/chat.service';

@Controller('rooms')
@ApiTags('rooms')
@UseGuards(JwtAuthenticateGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService,
    private readonly userService: UsersService,
    ) { }


  @Post()
  @ApiParam(CreateRoomDto)
  async create(@Body() createRoomDto: CreateRoomDto, @Request() req : any) {
    const room = new Room();
    room.name = createRoomDto.name;

    room.lessonId = createRoomDto.lessonId;
    room.users = await this.userService.findByIds(createRoomDto.users || []);
    if (createRoomDto.withAdmin) {
      const admins = await this.userService.findAdmins();
      room.users = [...room.users, ...admins];
    }
    const current = await this.userService.findOne(req.user.id);
    room.users.push(current!);
    const createdRoom = await this.roomService.create(room);
    return createdRoom;
  }


  @UseGuards(JwtAuthenticateGuard)
  @Get('/my')
  async findAll( @Request() req : any) {
    console.log("getting room for", req.user);
    return await this.roomService.findAll(req.user.id)
  }

  @Get(':id/messages')
  public getRoomMessages(@Param('id') id :number){
    return this.roomService.getAllMessagesInRoom(id);
  }


  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roomService.findOne(id);
  }

}
