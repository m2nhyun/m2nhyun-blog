export interface Post {
    id: string;
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    tags: string[];
    category?: string;
    author: string;
    authorId: string;
    featured: boolean;
    published: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
    readingTime?: number;
    views?: number;
    likes?: number;
}

export interface PostCreateData {
    title: string;
    content: string;
    slug: string;
    excerpt?: string;
    tags: string[];
    category?: string;
    featured?: boolean;
    published?: boolean;
}

export interface PostUpdateData extends Partial<PostCreateData> {
    id: string;
}
