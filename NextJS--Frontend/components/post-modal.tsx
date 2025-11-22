'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Post } from '@/types/content'
import { getStrapiMedia } from '@/lib/strapi'
import { formatDate } from '@/lib/format'
import { RichText } from './rich-text'
import { TagPill } from './ui/tag-pill'

interface PostModalProps {
  post: Post
  onClose: () => void
}

export default function PostModal({ post, onClose }: PostModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    window.addEventListener('keydown', handleEscape)
    
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const coverMedia = post.cover ?? null
  const coverUrl = coverMedia?.url
    ? getStrapiMedia(coverMedia.url)
    : 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80'

  const handleBackToFeed = useCallback(() => {
    onClose()
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      })
    }
  }, [onClose])

  const primaryCategory = post.categories?.[0]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-close">
          <button type="button" className="modal-back-btn" onClick={handleBackToFeed}>
            <span aria-hidden="true">←</span>
            Back to main page
          </button>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
        
        <div className="modal-body">
          {/* Cover Image */}
          <div className="relative w-full h-[280px] md:h-[420px] rounded-2xl overflow-hidden mb-8">
            <Image
              src={coverUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 900px) 100vw, 900px"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.avatar && (
                  <div className="relative w-8 h-8 rounded-full overflow-hidden">
                    <Image
                      src={getStrapiMedia(post.author.avatar.url)}
                      alt={post.author.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="font-medium text-white/90">{post.author.name}</span>
              </div>
            )}
            
            {primaryCategory && (
              <>
                <span className="text-white/40">•</span>
                <span 
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(255, 123, 0, 0.15)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(255, 123, 0, 0.3)'
                  }}
                >
                  {primaryCategory.name}
                </span>
              </>
            )}
            
            {post.publishedAt && (
              <>
                <span className="text-white/40">•</span>
                <time className="text-white/60">{formatDate(post.publishedAt)}</time>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-white">
            {post.title}
          </h1>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag) => (
                <TagPill key={tag.id} label={tag.name} />
              ))}
            </div>
          )}

          {/* Content */}
          {post.content && (
            <div className="article-content">
              <RichText content={post.content} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
