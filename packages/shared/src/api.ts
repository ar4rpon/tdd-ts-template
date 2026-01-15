import { z } from 'zod';
import {
  UserSchema,
  CreateUserSchema,
  UpdateUserSchema,
  PostSchema,
  CreatePostSchema,
  UpdatePostSchema,
  PostWithAuthorSchema,
  PostWithAuthorAndTagsSchema,
} from './types';

export const ApiErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  error: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const HealthResponseSchema = z.object({
  status: z.literal('ok'),
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;

export const GetUsersResponseSchema = z.object({
  data: z.array(UserSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type GetUsersResponse = z.infer<typeof GetUsersResponseSchema>;

export const CreateUserRequestSchema = CreateUserSchema;
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>;

export const UpdateUserRequestSchema = UpdateUserSchema;
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>;

export const CreateUserResponseSchema = UserSchema;
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;

export const GetPostsResponseSchema = z.object({
  data: z.array(PostWithAuthorSchema),
  total: z.number(),
  page: z.number(),
  limit: z.number(),
});

export type GetPostsResponse = z.infer<typeof GetPostsResponseSchema>;

export const GetPostResponseSchema = PostWithAuthorAndTagsSchema;
export type GetPostResponse = z.infer<typeof GetPostResponseSchema>;

export const CreatePostRequestSchema = CreatePostSchema;
export type CreatePostRequest = z.infer<typeof CreatePostRequestSchema>;

export const UpdatePostRequestSchema = UpdatePostSchema;
export type UpdatePostRequest = z.infer<typeof UpdatePostRequestSchema>;

export const CreatePostResponseSchema = PostSchema;
export type CreatePostResponse = z.infer<typeof CreatePostResponseSchema>;

export const API_ENDPOINTS = {
  health: '/health',
  users: '/users',
  user: (id: string) => `/users/${id}`,
  posts: '/posts',
  post: (id: string) => `/posts/${id}`,
  userPosts: (userId: string) => `/users/${userId}/posts`,
} as const;
