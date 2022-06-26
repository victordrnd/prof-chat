import { Room } from '../../room/entities/room.entity';
import { Message } from '../../message/entities/message.entity';
import { AfterLoad, Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { S3Service } from 'src/utils/services/s3.service';
import { ConfigService } from '@nestjs/config';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstname?: string;

  @Column()
  lastname?: string;

  @Column({ unique: true, select: false })
  email?: string;

  @Column({ select: false })
  password?: string;

  @Column({ nullable: true, select: false  })
  phone?: string;

  @Column({ length: 1, nullable: true, select: false })
  sexe?: string

  @Column({ nullable: true, select: false })
  role_id?: number

  @Column({ nullable: true, select: false })
  stripe_id?: string

  @Column({ nullable: true, select: false })
  default_pm?: string

  @Column({ nullable: true, select: false })
  address_id?: number

  @Column({ nullable: true })
  avatar?: string

  @Column({ default: false, select: false  })
  is_verified?: boolean

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" , select: false } )
  public created_at?: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)", select: false  })
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