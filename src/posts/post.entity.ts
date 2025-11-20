import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { postStatus } from './enums/postStatus.enum';
import { CreatePostMetaOptionsDto } from '../meta-options/dtos/create-post-meta-options.dto';
import { postType } from './enums/postType.enum';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publishOn?: Date;

  // uni-directional one-to-one relationships
  // @OneToOne(() => MetaOption, { nullable: true })
  // @JoinColumn() // this will create the relationship column (metaOptionsId) in the post table
  // metaOptions?: MetaOption | null;

  // Adding one-to-one relationshis using CASCADE
  // @OneToOne(() => MetaOption, { cascade: true, eager: true })
  // @JoinColumn() // this will create the relationship column (metaOptionsId) in the post table
  // metaOptions?: MetaOption | null;

  // Bi-directional one-to-one relationships
  @OneToOne(() => MetaOption, (metaOptions) => metaOptions.post, {
    cascade: true,
    eager: true,
  })
  // this will create the relationship column (metaOptionsId) in the post table
  // We will use @JoinColumn only on one side of the relationship
  // We put it here on the Post side
  // We will remove this from here and put it on the MetaOption side as we are going to implement cascading delete and we want MetaOption to be the owner of the relationship, so that we can delete a post. Otherwise we have to first delete the metaOption reference from the post and then delete the post.
  // @JoinColumn()
  metaOptions?: MetaOption | null;

  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;

  // Uni-directional Many-to-many relationship with Tag entity
  // @ManyToMany(() => Tag, { eager: true })
  // // We put the JoinTable decorator only on one side of the relationship and it will create the junction table
  // // When we use JoinTable, TypeORM considers this side as the owning side of the relationship
  // // We put the JoinTable on the owning side of the relationship which is the Post entity in this case
  // // When we delete a post, the corresponding entries in the junction table will be deleted automatically, but the tags will remain in the Tag table
  // // This is cascade delete for many-to-many relationships
  // @JoinTable()
  // tags?: Tag[];

  // Bi-directional Many-to-many relationship with Tag entity
  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable()
  tags?: Tag[];
}
