import type { Post } from '$lib/types'

export async function getPosts(): Promise<Post[]> {
    // Your existing logic to fetch posts data
    let posts: Post[] = []

    const paths = import.meta.glob('/src/posts/*.md', { eager: true })

    for (const path in paths) {
        const file = paths[path]
        const slug = path.split('/').at(-1)?.replace('.md', '')

        if (file && typeof file === 'object' && 'metadata' in file && slug) {
            const metadata = file.metadata as Omit<Post, 'slug'>
            const post = { ...metadata, slug } satisfies Post
            post.published && posts.push(post)
        }
    }

    posts = posts.sort((first, second) =>
        new Date(second.date).getTime() - new Date(first.date).getTime()
    )

    return posts
}

export async function getPostsData(): Promise<any[]> {
    const posts = await getPosts()
    return posts.map(post => ({
        title: post.title,
        description: post.description,
        slug: post.slug,
        date: new Date(post.date).toUTCString()
    }))
}
