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
                      <span className="text-2xl">NPR</span>
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
                <button
                  onClick={() => {
                    if (product.stock > 0) {
                      const message = encodeURIComponent(`Hi, I'm interested in ${product.title}. Price: NPR ${product.price}`)
                      window.open(`https://wa.me/9779867756915?text=${message}`, '_blank')
                    }
                  }}
                  disabled={product.stock <= 0}
                  className={`w-full flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg ${
                    product.stock > 0
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {product.stock > 0 ? (
                    <>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Buy Now via WhatsApp
                    </>
                  ) : 'Out of Stock'}
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  Click to chat on WhatsApp and place your order instantly
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
