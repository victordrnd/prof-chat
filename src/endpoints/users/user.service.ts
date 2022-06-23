import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CachingService } from 'src/common/caching/caching.service';
import { Constants } from 'src/utils/constants';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private cacheService : CachingService
  ) { }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findByIds(ids : Array<number>){
    console.log(ids);
    return this.usersRepository.find({
      where : {
        id : In(ids)
      }
    });
  }
 

  async findOne(id: number): Promise<User | undefined> {
    return this.cacheService.getOrSetCache(
      'user:' + id.toString,
      async () => {
        return this.usersRepository.findOne(id);
      },
      Constants.oneDay()
    );
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}