'use client';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export function BlogPage() {
    const postsDirectory = path.join(process.cwd(), 'content/blog');
    const fileNames = fs.readdirSync(postsDirectory);

    const posts = fileNames.map((fileName) => {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);

        return {
            slug: fileName.replace(/\.md$/, ''),
            title: data.title,
            date: data.date,
        };
    });

    return (
        <div>
            <h1>Blog Posts</h1>
            <ul>
                {posts.map((post) => (
                    <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                        <br />
                        <small>{post.date}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
