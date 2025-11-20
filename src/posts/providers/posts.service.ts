import { Body, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
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

    let tags = await this.tagsService.findMultipeTags(createPostDto.tags || []);

    let post = this.postsRepository.create({
      ...createPostDto,
      author: author,
      tags: tags,
    });
    return await this.postsRepository.save(post);
  }

  public async findAll(userId: string) {
    // const user = this.usersService.findOneById(userId);

    // Without eager loadings
    // let posts = await this.postsRepository.find({
    //   relations: { metaOptions: true, author: true, tags: true },
    // });

    let posts = await this.postsRepository.find();
    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags = await this.tagsService.findMultipeTags(patchPostDto.tags || []);

    let post = await this.postsRepository.findOneBy({
      id: patchPostDto.id,
    });

    if (post) {
      post.title = patchPostDto.title ?? post.title;
      post.content = patchPostDto.content ?? post.content;
      post.status = patchPostDto.status ?? post.status;
      post.postType = patchPostDto.postType ?? post.postType;
      post.slug = patchPostDto.slug ?? post.slug;
      post.featuredImageUrl =
        patchPostDto.featuredImageUrl ?? post.featuredImageUrl;
      post.publishOn = patchPostDto.publishOn ?? post.publishOn;
      post.tags = tags;

      return await this.postsRepository.save(post);
    }
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
