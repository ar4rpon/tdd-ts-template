import type { Prisma, User, Post, Tag, Role } from '@prisma/client';

export type { User, Post, Tag, Role };

export type UserWithPosts = Prisma.UserGetPayload<{
  include: { posts: true };
}>;

export type PostWithAuthor = Prisma.PostGetPayload<{
  include: { author: true };
}>;

export type PostWithAuthorAndTags = Prisma.PostGetPayload<{
  include: { author: true; tags: true };
}>;

export type UserCreateInput = Prisma.UserCreateInput;
export type UserUpdateInput = Prisma.UserUpdateInput;
export type UserWhereInput = Prisma.UserWhereInput;
export type UserWhereUniqueInput = Prisma.UserWhereUniqueInput;

export type PostCreateInput = Prisma.PostCreateInput;
export type PostUpdateInput = Prisma.PostUpdateInput;
export type PostWhereInput = Prisma.PostWhereInput;
export type PostWhereUniqueInput = Prisma.PostWhereUniqueInput;

export type TagCreateInput = Prisma.TagCreateInput;
export type TagUpdateInput = Prisma.TagUpdateInput;

export type { Prisma };
