import { Message } from "../../../endpoints/message/entities/message.entity";
import { User } from "../../../endpoints/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column()
    name?: string;
  
    @Column({nullable : true})
    lessonId?: number;


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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at?: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at?: Date;
}
