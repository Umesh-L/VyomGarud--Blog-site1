
import { PostCard } from './post-card'
import { Post } from '@/types/content'

interface PostCardGridProps {
  posts: Post[]
}

export function PostCardGrid({ posts }: PostCardGridProps) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <PostCard key={`${post.id}-${index}`} post={post} />
      ))}
    </div>
  )
}
