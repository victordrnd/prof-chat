import { Message } from 'src/endpoints/message/entities/message.entity';
import { Room } from 'src/endpoints/room/entities/room.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstname?: string;

  @Column()
  lastname?: string;

  @Column()
  email?: string;

  @ManyToMany(() => Room)
  @JoinTable()
  rooms? : Room[];

  @OneToMany(() => Message, (message: Message) => message.user)
  messages? : Message[];
}