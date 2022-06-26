import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { Room } from "src/endpoints/room/entities/room.entity";
import { EventsGateway } from "./events.gateway";

@Injectable()
export class ChatService {
    constructor(private readonly eventsGateway : EventsGateway){}


    @OnEvent('room_created')
    handleRoomCreatedEvent(payload: Room) {
        console.log(payload);
    }
}