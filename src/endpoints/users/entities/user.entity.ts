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

  @Column()
  password?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ length: 1, nullable: true })
  sexe?: string

  @Column({ nullable: true })
  role_id?: number

  @Column({ nullable: true })
  stripe_id?: string

  @Column({ nullable: true })
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

  @ManyToMany(() => Room)
  @JoinTable()
  rooms?: Room[];

}