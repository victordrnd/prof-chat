import { ApiProperty } from "@nestjs/swagger";

export class CreateMessageDto {

    @ApiProperty()
    type? : string;
    @ApiProperty()
    content : string = "";
    @ApiProperty()
    roomId? : number;
}
