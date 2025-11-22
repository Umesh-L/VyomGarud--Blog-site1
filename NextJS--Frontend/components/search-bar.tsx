'use client'

import { useMemo, useRef, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/content'

interface SearchBarProps {
  posts: Post[]
}

export function SearchBar({ posts }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const results = useMemo(() => {
    if (!query.trim()) return []
    const normalized = query.trim().toLowerCase()
    return posts
      .filter((post) => {
        const haystack = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase()
        return haystack.includes(normalized)
      })
      .slice(0, 6)
  }, [posts, query])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (results.length === 0) return
    const next = results[0]
    const handle = next.slug ?? String(next.id)
    router.push(`/posts/${handle}`)
    setOpen(false)
  }

  return (
    <div className="relative w-full" onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}>
      <form
        onSubmit={handleSubmit}
        className="hero-search reveal-up reveal-delay-2 mx-auto flex max-w-xl items-center gap-3 rounded-full border border-white/30 bg-white/10 px-5 py-3 gradient-border"
        onMouseDown={(event) => {
          const target = event.target as HTMLElement
          if (target.tagName === 'BUTTON' || target.tagName === 'INPUT') return
          event.preventDefault()
          inputRef.current?.focus()
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-on-dark"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          type="search"
          ref={inputRef}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search VyomGarud missions"
          className="flex-1 bg-transparent text-sm text-on-dark placeholder:text-on-dark-subtle focus:outline-none"
          aria-label="Search posts"
        />
        <button
          type="submit"
          className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-on-dark"
        >
          Search
        </button>
      </form>

      {open && query.trim() && (
        <div className="mx-auto mt-3 w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[var(--charcoal-soft)]/95 shadow-2xl backdrop-blur">
          {results.length === 0 ? (
            <p className="px-5 py-4 text-sm text-white/60">No missions found for “{query}”.</p>
          ) : (
            <ul>
              {results.map((post) => {
                const handle = post.slug ?? String(post.id)
                return (
                  <li key={post.id}>
                    <Link
                      href={`/posts/${handle}`}
                      className="flex flex-col gap-1 border-b border-white/5 px-5 py-4 text-left text-sm text-white/90 transition hover:bg-white/5"
                      onClick={() => setOpen(false)}
                    >
                      <span className="font-semibold">{post.title}</span>
                      <span className="text-xs text-white/60 line-clamp-1">{post.excerpt}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
