import {
  BadRequestException,
  Body,
  Injectable,
  Logger,
  Req,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { TagsService } from 'src/tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from 'src/tags/tag.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from 'src/common/pagination/providers/pagination.provider';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
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

  public async findAll(postQuery: GetPostsDto, userId: string) {
    // const user = this.usersService.findOneById(userId);

    // Without eager loadings
    // let posts = await this.postsRepository.find({
    //   relations: { metaOptions: true, author: true, tags: true },
    // });

    // Ensure defaults in case `limit` or `page` are undefined at runtime
    // const limit = postQuery.limit ?? 10;
    // const page = postQuery.page ?? 1;

    // With pagination and eager loadings
    // const posts = await this.postsRepository.find({
    //   take: limit,
    //   skip: (page - 1) * limit,
    // });

    // With the pagination provider
    const posts = await this.paginationProvider.paginateQuery(
      { limit: postQuery.limit, page: postQuery.page },
      this.postsRepository,
    );

    return posts;
  }

  public async update(patchPostDto: PatchPostDto) {
    let tags: Tag[] | null;
    let post: Post | null;

    try {
      tags = await this.tagsService.findMultipeTags(patchPostDto.tags || []);
    } catch (error) {
      this.logger.error('Error fetching tags', error);

      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
      );
    }

    if (!tags || tags.length !== patchPostDto.tags?.length) {
      throw new BadRequestException(
        'Please check your tag Ids and ensure they are correct',
      );
    }

    try {
      post = await this.postsRepository.findOneBy({
        id: patchPostDto.id,
      });
    } catch (error) {
      this.logger.error('Error fetching tags', error);

      throw new RequestTimeoutException(
        'Unable to process your request at the moment. Please try later.',
      );
    }

    if (!post) {
      throw new BadRequestException('Post ID does not exist');
    }

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

      try {
        await this.postsRepository.save(post);
      } catch (error) {
        this.logger.error('Error updating post', error);
        throw new RequestTimeoutException(
          'Unable to process your request at the moment. Please try later.',
        );
      }
    }
    return post;
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
