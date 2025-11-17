import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    // @InjectRepository(MetaOption)
    // private readonly metaOptionsRepository: Repository<MetaOption>, // not good, this is dirty
  ) {}

  public async create(@Body() createPostDto: CreatePostDto) {
    // Before introducing CASCADE
    // let metaOptions = createPostDto.metaOptions
    //   ? this.metaOptionsRepository.create(createPostDto.metaOptions)
    //   : null;
    // if (metaOptions) {
    //   await this.metaOptionsRepository.save(metaOptions);
    // }
    // let post = this.postsRepository.create(createPostDto);
    // if (metaOptions) {
    //   post.metaOptions = metaOptions;
    // }
    // return await this.postsRepository.save(post);

    let author = await this.usersService.findOneById(createPostDto.authorId);
    if (!author) {
      throw new Error('Author not found');
    }
    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
    });
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    // const user = this.usersService.findOneById(userId);

    // Without eager loadings
    // let posts = await this.postsRepository.find({
    //   relations: { metaOptions: true },
    // });

    let posts = await this.postsRepository.find();
    return posts;
  }

  public async delete(id: number) {
    // let post = await this.postsRepository.findOneBy({ id });
    // await this.postsRepository.delete(id);

    // if (post?.metaOptions) {
    //   await this.metaOptionsRepository.delete(post.metaOptions.id);
    // }

    // Unnecessary code with CASCADE
    // let inversePost = await this.metaOptionsRepository.find({
    //   where: { id: post?.metaOptions?.id },
    //   relations: { post: true },
    // });
    // console.log(inversePost);

    // for (let item of inversePost) {
    //   console.log(item?.post?.metaOptions);
    // }

    await this.postsRepository.delete(id);
    return { deleted: true, id };
  }
}
