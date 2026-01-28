'use client'

import { useEffect } from 'react'

interface DynamicMetaProps {
  title: string
  description: string
  image?: string
  type?: string
  publishedTime?: string
}

export default function DynamicMeta({ title, description, image, type = 'website', publishedTime }: DynamicMetaProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | ElectroPhobia`
    
    // Update or create meta tags
    const updateMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('property', property)
        document.head.appendChild(meta)
      }
      meta.content = content
    }
    
    const updateMetaName = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', name)
        document.head.appendChild(meta)
      }
      meta.content = content
    }
    
    // OpenGraph tags
    updateMetaTag('og:title', title)
    updateMetaTag('og:description', description)
    updateMetaTag('og:type', type)
    updateMetaTag('og:url', window.location.href)
    updateMetaTag('og:site_name', 'ElectroPhobia')
    
    if (image) {
      // Handle backend images (from Railway) vs frontend images
      let imageUrl = image
      
      if (image.startsWith('/uploads/')) {
        // Backend image - construct full Railway URL
        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
        imageUrl = `${backendUrl}${image}`
      } else if (!image.startsWith('http')) {
        // Frontend static image
        imageUrl = `${window.location.origin}${image}`
      }
      
      updateMetaTag('og:image', imageUrl)
      updateMetaTag('og:image:secure_url', imageUrl)
      updateMetaTag('og:image:width', '1200')
      updateMetaTag('og:image:height', '630')
      updateMetaName('twitter:image', imageUrl)
    }
    
    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime)
    }
    
    // Twitter Card tags
    updateMetaName('twitter:card', 'summary_large_image')
    updateMetaName('twitter:title', title)
    updateMetaName('twitter:description', description)
    
    // Standard meta tags
    updateMetaName('description', description)
    
  }, [title, description, image, type, publishedTime])
  
  return null
}
