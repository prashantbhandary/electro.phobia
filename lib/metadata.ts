// Metadata generation utilities for dynamic Open Graph images

export async function generateBlogMetadata(slug: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${API_URL}/blogs/slug/${slug}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) throw new Error('Blog not found')
    
    const blog = await response.json()
    
    // Get the image URL - handle both direct URLs and backend paths
    let imageUrl = blog.imageUrl
    if (imageUrl && !imageUrl.startsWith('http')) {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
      imageUrl = `${backendUrl}${imageUrl}`
    }
    
    return {
      title: `${blog.title} | ElectroPhobia`,
      description: blog.excerpt || blog.content?.substring(0, 160),
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.content?.substring(0, 160),
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: blog.title,
          }
        ] : undefined,
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
    return {
      title: 'Blog Post | ElectroPhobia',
      description: 'Read our latest electronics blog posts and tutorials',
    }
  }
}

export async function generateProjectMetadata(id: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${API_URL}/projects/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) throw new Error('Project not found')
    
    const project = await response.json()
    
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
    return {
      title: 'Project | ElectroPhobia',
      description: 'Explore our electronics projects',
    }
  }
}

export async function generateExperienceMetadata(id: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${API_URL}/experiences/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) throw new Error('Experience not found')
    
    const experience = await response.json()
    
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
    return {
      title: 'Experience | ElectroPhobia',
      description: 'Explore our experiences and achievements',
    }
  }
}
