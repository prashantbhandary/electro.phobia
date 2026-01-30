'use client'

import { useState, useEffect } from 'react'
import { FiArrowLeft, FiPackage, FiDollarSign, FiTag, FiCalendar, FiShoppingCart } from 'react-icons/fi'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { productAPI } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'
import DynamicMeta from '@/components/DynamicMeta'

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const id = params.id as string
        const data = await productAPI.getById(id)
        setProduct(data)
      } catch (err: any) {
        console.error('Error fetching product:', err)
        setError(err.message || 'Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner message="Loading product" size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
          <Link 
            href="/shop"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Shop</span>
          </Link>
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">{error || 'The product you are looking for does not exist.'}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {product && (
        <DynamicMeta
          title={product.title}
          description={product.description?.substring(0, 160) || ''}
          image={product.imageUrl}
          type="product"
        />
      )}
      <article className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Back Button */}
          <Link 
            href="/shop"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary-600 mb-8"
          >
            <FiArrowLeft />
            <span>Back to Shop</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiPackage className="w-32 h-32 text-gray-400 dark:text-gray-600" />
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Featured Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold flex items-center gap-2">
                  <FiTag className="w-4 h-4" />
                  {product.category}
                </span>
                {product.featured && (
                  <span className="px-4 py-2 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                {product.title}
              </h1>

              {/* Price */}
              <div className="py-4 border-y border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-4xl font-bold text-primary">
                      <FiDollarSign className="w-8 h-8" />
                      {product.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-right">
                    {product.stock > 0 ? (
                      <div className="space-y-1">
                        <p className="text-green-600 dark:text-green-400 font-semibold">In Stock</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.stock} available</p>
                      </div>
                    ) : (
                      <p className="text-red-600 dark:text-red-400 font-semibold">Out of Stock</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {product.description}
                </ReactMarkdown>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <Link
                  href="/contact"
                  className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold transition-colors ${
                    product.stock > 0
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed pointer-events-none'
                  }`}
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {product.stock > 0 ? 'Contact to Purchase' : 'Out of Stock'}
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Get in touch to place your order
                </p>
              </div>

              {/* Meta Info */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FiCalendar className="w-5 h-5" />
                  <span>Listed on {new Date(product.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
