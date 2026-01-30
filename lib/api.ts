// API base URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Get auth token from localStorage
export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminToken')
  }
  return null
}

// Get admin data from localStorage
export const getAdminData = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem('adminData')
    return data ? JSON.parse(data) : null
  }
  return null
}

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken()
}

// Logout
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminData')
    window.location.href = '/admin/login'
  }
}

// API helper function
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  
  console.log('API Call:', {
    endpoint,
    method: options.method || 'GET',
    hasToken: !!token,
  });
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)
    
    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text()
      console.error('Non-JSON response:', text)
      throw new Error(`Backend server error: Expected JSON but got ${contentType}. Is the backend server running?`)
    }
    
    const data = await response.json()

    console.log('API Response:', {
      endpoint,
      status: response.status,
      ok: response.ok,
      data
    });

    if (!response.ok) {
      if (response.status === 401) {
        logout()
      }
      throw new Error(data.message || 'API request failed')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Experience API
export const experienceAPI = {
  getAll: async () => {
    const response = await apiCall('/experiences')
    return response.data || []
  },
  getById: async (id: string) => {
    const response = await apiCall(`/experiences/${id}`)
    return response.data || null
  },
  create: (data: any) => apiCall('/experiences', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/experiences/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/experiences/${id}`, { method: 'DELETE' }),
}

// Project API
export const projectAPI = {
  getAll: async (category?: string) => {
    const response = await apiCall(`/projects${category ? `?category=${category}` : ''}`)
    return response.data || []
  },
  getById: async (id: string) => {
    const response = await apiCall(`/projects/${id}`)
    return response.data || null
  },
  create: (data: any) => apiCall('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/projects/${id}`, { method: 'DELETE' }),
}

// Blog API
export const blogAPI = {
  getAll: async (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams(params as any).toString()
    const response = await apiCall(`/blogs${query ? `?${query}` : ''}`)
    return response.data || []
  },
  getBySlug: async (slug: string) => {
    const response = await apiCall(`/blogs/slug/${slug}`)
    return response.data || null
  },
  getById: async (id: string) => {
    const response = await apiCall(`/blogs/${id}`)
    return response.data || null
  },
  create: (data: any) => apiCall('/blogs', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/blogs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/blogs/${id}`, { method: 'DELETE' }),
}

// Product API
export const productAPI = {
  getAll: async (category?: string) => {
    const response = await apiCall(`/products${category ? `?category=${category}` : ''}`)
    return response.data || []
  },
  getById: async (id: string) => {
    const response = await apiCall(`/products/${id}`)
    return response.data || null
  },
  create: (data: any) => apiCall('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiCall(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiCall(`/products/${id}`, { method: 'DELETE' }),
}
