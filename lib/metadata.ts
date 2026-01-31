// Metadata generation utilities for dynamic Open Graph images

// Get API URL - works in both server and client environments
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://backend-j3mf.onrender.com/api'
}

export async function generateBlogMetadata(slug: string) {
  try {
    const API_URL = getApiUrl()
    console.log('Fetching blog metadata from:', `${API_URL}/blogs/slug/${slug}`)
    const response = await fetch(`${API_URL}/blogs/slug/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) throw new Error('Blog not found')
    
    const result = await response.json()
    const blog = result.data
    
    if (!blog) {
      throw new Error('Blog data not found')
    }
    
    // Get the image URL - handle both direct URLs and backend paths
    let imageUrl = blog.imageUrl
    if (imageUrl && !imageUrl.startsWith('http')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
      imageUrl = `${backendUrl}${imageUrl}`
    }
    
    // If it's a Facebook CDN URL, use image proxy to avoid blocking
    if (imageUrl && imageUrl.includes('fbcdn.net')) {
      // Use wsrv.nl as image proxy - it's free and reliable
      imageUrl = `https://wsrv.nl/?url=${encodeURIComponent(imageUrl)}&w=1200&h=630&fit=cover`
    }
    
    console.log('Blog metadata:', {
      title: blog.title,
      imageUrl: imageUrl,
      hasImage: !!imageUrl
    })
    
    // Construct absolute URLs to override parent metadata properly
    const absoluteImageUrl = imageUrl || 'https://electrophobia.tech/img/Logo.png'
    
    return {
      title: blog.title,
      description: blog.excerpt || blog.content?.substring(0, 160),
      metadataBase: null, // Prevent base URL from being prepended to absolute URLs
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.content?.substring(0, 160),
        url: `https://electrophobia.tech/blogs/${slug}`,
        siteName: 'ElectroPhobia',
        images: [{
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        }],
        type: 'article',
        publishedTime: blog.createdAt,
        authors: [blog.author || 'ElectroPhobia'],
      },
      twitter: {
        card: 'summary_large_image',
        title: blog.title,
        description: blog.excerpt || blog.content?.substring(0, 160),
        images: imageUrl ? [imageUrl] : undefined,
      },
    }
  } catch (error) {
    console.error('Error generating blog metadata:', error)
    return {
      title: 'Blog Post | ElectroPhobia',
      description: 'Read our latest electronics blog posts and tutorials',
    }
  }
}

export async function generateProjectMetadata(id: string) {
  try {
    const API_URL = getApiUrl()
    const response = await fetch(`${API_URL}/projects/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) throw new Error('Project not found')
    
    const result = await response.json()
    const project = result.data
    
    // Get the image URL - handle both direct URLs and backend paths
    let imageUrl = project.imageUrl
    if (imageUrl && !imageUrl.startsWith('http')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
      imageUrl = `${backendUrl}${imageUrl}`
    }
    
    return {
      title: `${project.title} | ElectroPhobia Projects`,
      description: project.description?.substring(0, 160) || 'Explore this electronics project',
      openGraph: {
        title: project.title,
        description: project.description?.substring(0, 160),
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: project.title,
          }
        ] : undefined,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description?.substring(0, 160),
        images: imageUrl ? [imageUrl] : undefined,
      },
    }
  } catch (error) {
    console.error('Error generating project metadata:', error)
    return {
      title: 'Project | ElectroPhobia',
      description: 'Explore our electronics projects',
    }
  }
}

export async function generateExperienceMetadata(id: string) {
  try {
    const API_URL = getApiUrl()
    const response = await fetch(`${API_URL}/experiences/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) throw new Error('Experience not found')
    
    const result = await response.json()
    const experience = result.data
    
    // Get the image URL - handle both direct URLs and backend paths
    let imageUrl = experience.imageUrl
    if (imageUrl && !imageUrl.startsWith('http')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
      imageUrl = `${backendUrl}${imageUrl}`
    }
    
    return {
      title: `${experience.title} | ElectroPhobia Experiences`,
      description: experience.description?.substring(0, 160) || 'Learn about this experience',
      openGraph: {
        title: experience.title,
        description: experience.description?.substring(0, 160),
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: experience.title,
          }
        ] : undefined,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: experience.title,
        description: experience.description?.substring(0, 160),
        images: imageUrl ? [imageUrl] : undefined,
      },
    }
  } catch (error) {
    console.error('Error generating experience metadata:', error)
    return {
      title: 'Experience | ElectroPhobia',
      description: 'Explore our experiences and achievements',
    }
  }
}
