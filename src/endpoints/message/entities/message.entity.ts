import { Room } from "../../../endpoints/room/entities/room.entity";
import { User } from "../../../endpoints/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column()
    type?: string;
  
    @Column()
    content?: string;

    files? : any[];
  
    @Column("int", { nullable: true })
    userId?: number;


    @Column("int", { nullable: true })
    roomId?: number;


    @ManyToOne(() => Room, (room: Room) => room.messages)
    room? : Room;

    @ManyToOne(() => User, (user: User) => user.messages)
    user? : User;

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at?: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    public updated_at?: Date;
}
