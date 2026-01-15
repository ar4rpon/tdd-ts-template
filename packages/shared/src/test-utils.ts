import type { User, Post, Tag, CreateUserDTO, CreatePostDTO } from './types';

export function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: crypto.randomUUID(),
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockCreateUser(overrides: Partial<CreateUserDTO> = {}): CreateUserDTO {
  return {
    email: 'test@example.com',
    name: 'Test User',
    role: 'USER',
    ...overrides,
  };
}

export function createMockUsers(count: number): User[] {
  return Array.from({ length: count }, (_, i) =>
    createMockUser({
      id: crypto.randomUUID(),
      email: `user${i + 1}@example.com`,
      name: `User ${i + 1}`,
    })
  );
}

export function createMockPost(overrides: Partial<Post> = {}): Post {
  return {
    id: crypto.randomUUID(),
    title: 'Test Post',
    content: 'Test content',
    published: false,
    authorId: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

export function createMockCreatePost(overrides: Partial<CreatePostDTO> = {}): CreatePostDTO {
  return {
    title: 'Test Post',
    content: 'Test content',
    published: false,
    authorId: crypto.randomUUID(),
    ...overrides,
  };
}

export function createMockPosts(count: number, authorId?: string): Post[] {
  const author = authorId ?? crypto.randomUUID();
  return Array.from({ length: count }, (_, i) =>
    createMockPost({
      id: crypto.randomUUID(),
      title: `Post ${i + 1}`,
      authorId: author,
    })
  );
}

export function createMockTag(overrides: Partial<Tag> = {}): Tag {
  return {
    id: crypto.randomUUID(),
    name: 'test-tag',
    ...overrides,
  };
}

export async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
