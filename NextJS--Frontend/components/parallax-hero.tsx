'use client'

import { useEffect, useRef } from 'react'

interface ParallaxHeroProps {
  children: React.ReactNode
}

export function ParallaxHero({ children }: ParallaxHeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const scrolled = window.scrollY
      heroRef.current.style.setProperty('--scroll', scrolled.toString())
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={heroRef} className="hero-parallax">
      {children}
    </div>
  )
}
