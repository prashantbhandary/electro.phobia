'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'
import { FiInstagram, FiArrowRight } from 'react-icons/fi'

// Add your Instagram post permalinks here
const INSTAGRAM_POSTS = [
  'https://www.instagram.com/p/DWbtd9iFXz5/',
  'https://www.instagram.com/p/DWNVsa7jVuV/',
  'https://www.instagram.com/p/DWWlLF2D66c/',
  'https://www.instagram.com/p/DVnw0VDjWok/',
  'https://www.instagram.com/p/DThVzKSE61r/',
  'https://www.instagram.com/p/DY0Gfl_Kyfe/',
]

const INSTAGRAM_PROFILE = 'https://www.instagram.com/electro.phobia/'

export default function InstagramFeed() {
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process()
    }
  }, [])

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <FiInstagram className="w-6 h-6 text-primary" />
              <span className="text-primary font-semibold text-sm">@electro.phobia</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              From the Feed
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Videos, builds, and random electronics stuff
            </p>
          </div>
          <Link
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-2 text-primary hover:text-primary-600 font-semibold"
          >
            <span>Follow us</span>
            <FiArrowRight />
          </Link>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {INSTAGRAM_POSTS.map((postUrl, index) => (
            <div key={index} className="break-inside-avoid">
              <blockquote
                className="instagram-media"
                data-instgrm-permalink={postUrl}
                data-instgrm-version="14"
                style={{
                  background: '#FFF',
                  border: '0',
                  borderRadius: '12px',
                  boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
                  margin: '0',
                  maxWidth: '100%',
                  minWidth: '326px',
                  padding: '0',
                  width: '100%',
                }}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 font-semibold"
          >
            <FiInstagram className="w-5 h-5" />
            <span>Follow on Instagram</span>
            <FiArrowRight />
          </Link>
        </div>
      </div>

      <Script
        src="//www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if ((window as any).instgrm) {
            (window as any).instgrm.Embeds.process()
          }
        }}
      />
    </section>
  )
}
