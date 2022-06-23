import { Message } from "../../../endpoints/message/entities/message.entity";
import { User } from "../../../endpoints/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column()
    name?: string;
  
    @ManyToMany(type => User, user => user.rooms, {cascade : true})
    @JoinTable({
        name: "users_rooms_rooms",
        joinColumn: { name: "roomsId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "usersId" }
      })
    users?: User[];
  
    @OneToMany(() => Message, (message: Message) => message.room, {cascade :true})
    messages?: Message[];

    @OneToOne(type => Message, (message: Message) => message.room)
    last_message? : Message
}
