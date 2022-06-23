import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Room } from './entities/room.entity';
import { UsersService } from '../users/user.service';
import { JwtAuthenticateGuard } from 'src/utils/guards/jwt.authenticate.guard';
import { Jwt } from 'src/utils/decorators/jwt';
import { User } from '../users/entities/user.entity';

@Controller('rooms')
@ApiTags('rooms')
@UseGuards(JwtAuthenticateGuard)
export class RoomController {
  constructor(private readonly roomService: RoomService,
    private readonly userService: UsersService) { }


  @Post()
  @ApiParam(CreateRoomDto)
  async create(@Body() createRoomDto: CreateRoomDto) {
    const room = new Room();
    room.name = createRoomDto.name;
    room.users = await this.userService.findByIds(createRoomDto.users);
    return this.roomService.create(room);
  }



  @Get('/my')
  @UseGuards(JwtAuthenticateGuard)
  async findAll(@Jwt() user: User) {
    console.log(user);
    return await this.roomService.findAll(user.id!)
  }





  @Get(':id/messages')
  getAllMessageInRoom(@Param('id') room_id: number) {
    return this.roomService.getAllMessagesInRoom(room_id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.roomService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
