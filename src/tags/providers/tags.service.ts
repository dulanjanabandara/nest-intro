import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async create(createTagDto: CreateTagDto) {
    let tag = this.tagsRepository.create(createTagDto);
    tag = await this.tagsRepository.save(tag);
    return tag;
  }

  public async findMultipeTags(tags: number[]) {
    let results = await this.tagsRepository.find({
      where: { id: In(tags) },
    });

    return results;
  }

  public async delete(id: number) {
    await this.tagsRepository.delete(id);
    return { deleted: true, id };
  }

  public async softDelete(id: number) {
    await this.tagsRepository.softDelete(id); // this will create a deletedAt timestamp and will not actually delete the record from the database
    return { deleted: true, id };
  }
}
