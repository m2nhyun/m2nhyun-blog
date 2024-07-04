// import fs from 'fs';
// import path from 'path';
// import matter from 'gray-matter';
// import { remark } from 'remark';
// import html from 'remark-html';

// export async function generateStaticParams() {
//     const postsDirectory = path.join(process.cwd(), 'content/blog');
//     const fileNames = fs.readdirSync(postsDirectory);

//     return fileNames.map((fileName) => ({
//         slug: fileName.replace(/\.md$/, ''),
//     }));
// }

// export async function BlogPost({ params }: { params: { slug: string } }) {
//     const fullPath = path.join(
//         process.cwd(),
//         'content/blog',
//         `${params.slug}.md`,
//     );
//     const fileContents = fs.readFileSync(fullPath, 'utf8');
//     const { data, content } = matter(fileContents);

//     const processedContent = await remark().use(html).process(content);
//     const contentHtml = processedContent.toString();

//     return (
//         <article>
//             <h1>{data.title}</h1>
//             <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
//         </article>
//     );
// }
