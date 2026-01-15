export {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  PostSchema,
  CreatePostSchema,
  UpdatePostSchema,
  TagSchema,
  CreateTagSchema,
  RoleSchema,
  UserWithPostsSchema,
  PostWithAuthorSchema,
  PostWithAuthorAndTagsSchema,
  type UserDTO,
  type CreateUserDTO,
  type UpdateUserDTO,
  type PostDTO,
  type CreatePostDTO,
  type UpdatePostDTO,
  type TagDTO,
  type CreateTagDTO,
  type RoleType,
  type UserWithPostsDTO,
  type PostWithAuthorDTO,
  type PostWithAuthorAndTagsDTO,
} from '@repo/database/schemas';

export type {
  User,
  Post,
  Tag,
  Role,
  UserWithPosts,
  PostWithAuthor,
  PostWithAuthorAndTags,
  UserCreateInput,
  UserUpdateInput,
  PostCreateInput,
  PostUpdateInput,
} from '@repo/database/types';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}
