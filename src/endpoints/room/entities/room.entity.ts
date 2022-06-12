import { Message } from "../../../endpoints/message/entities/message.entity";
import { User } from "../../../endpoints/users/entities/user.entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column()
    name?: string;
  
    @ManyToMany(() => User)
    @JoinTable()
    users?: User[];
  
    @OneToMany(() => Message, (message: Message) => message.room)
    messages?: Message[];
}
