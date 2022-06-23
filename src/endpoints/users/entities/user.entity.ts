import { Room } from '../../room/entities/room.entity';
import { Message } from '../../message/entities/message.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstname?: string;

  @Column()
  lastname?: string;

  @Column({ unique: true })
  email?: string;

  @Column({select : false})
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ length: 1, nullable: true })
  sexe?: string

  @Column({ nullable: true })
  role_id?: number

  @Column({ nullable: true,select : false })
  stripe_id?: string

  @Column({ nullable: true, select : false })
  default_pm?: string

  @Column({ nullable: true })
  address_id?: number

  @Column({ nullable: true })
  avatar?: string

  @Column({ default: false })
  is_verified?: boolean

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at?: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  public updated_at?: Date;

  @OneToMany(() => Message, (message: Message) => message.user)
  messages?: Message[];

  @ManyToMany(type => Room, room => room.users)
  @JoinTable({
    name: "users_rooms_rooms",
    joinColumn: { name: "usersId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roomsId" }
  })
  rooms?: Room[];

}