import { z } from 'zod';

export const RoleSchema = z.enum(['USER', 'ADMIN']);
export type RoleType = z.infer<typeof RoleSchema>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1),
  role: RoleSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: RoleSchema.optional().default('USER'),
});

export const UpdateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).optional(),
  role: RoleSchema.optional(),
});

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  content: z.string().nullable(),
  published: z.boolean(),
  authorId: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const CreatePostSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  published: z.boolean().optional().default(false),
  authorId: z.string().uuid(),
  tags: z.array(z.string()).optional(),
});

export const UpdatePostSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().nullable().optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const TagSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1),
});

export const UserWithPostsSchema = UserSchema.extend({
  posts: z.array(PostSchema),
});

export const PostWithAuthorSchema = PostSchema.extend({
  author: UserSchema,
});

export const PostWithAuthorAndTagsSchema = PostSchema.extend({
  author: UserSchema,
  tags: z.array(TagSchema),
});

export type UserDTO = z.infer<typeof UserSchema>;
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

export type PostDTO = z.infer<typeof PostSchema>;
export type CreatePostDTO = z.infer<typeof CreatePostSchema>;
export type UpdatePostDTO = z.infer<typeof UpdatePostSchema>;

export type TagDTO = z.infer<typeof TagSchema>;
export type CreateTagDTO = z.infer<typeof CreateTagSchema>;

export type UserWithPostsDTO = z.infer<typeof UserWithPostsSchema>;
export type PostWithAuthorDTO = z.infer<typeof PostWithAuthorSchema>;
export type PostWithAuthorAndTagsDTO = z.infer<typeof PostWithAuthorAndTagsSchema>;
