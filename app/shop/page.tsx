'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiShoppingCart, FiPackage, FiDollarSign, FiTag } from 'react-icons/fi'
import { productAPI } from '@/lib/api'
import Link from 'next/link'
import { initSocket, disconnectSocket } from '@/lib/socket'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()

    // Initialize WebSocket
    const socket = initSocket()

    // Listen for real-time product updates
    socket.on('product:created', handleProductUpdate)
    socket.on('product:updated', handleProductUpdate)
    socket.on('product:deleted', () => fetchProducts())

    return () => {
      socket.off('product:created', handleProductUpdate)
      socket.off('product:updated', handleProductUpdate)
      socket.off('product:deleted')
      disconnectSocket()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleProductUpdate = () => {
    fetchProducts()
  }

  const fetchProducts = async () => {
    try {
      const data = await productAPI.getAll()
      setProducts(Array.isArray(data) ? data.filter((prod: any) => prod.isPublished) : [])
    } catch (error) {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))]

  const filteredProducts = activeFilter === 'All' 
    ? products 
    : products.filter(product => product.category === activeFilter)

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-20 flex items-center justify-center">
        <LoadingSpinner message="Loading products" size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/5 dark:to-transparent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Our <span className="text-primary">Shop</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Browse our collection of custom PCBs, electronics kits, and modules. 
              All designed and tested for your projects.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white dark:bg-gray-900 sticky top-20 z-40 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => (
              <Link 
                key={product._id}
                href={`/shop/${product._id}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 group cursor-pointer h-full flex flex-col"
                >
                  {/* Product Image */}
                  <div className="h-64 bg-gray-100 dark:bg-gray-800 flex items-center justify-center relative overflow-hidden">
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <FiPackage className="w-20 h-20 text-gray-400 dark:text-gray-600" />
                    )}
                    
                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white">
                        {product.category}
                      </span>
                    </div>

                    {/* Stock Status */}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {product.featured && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-gray-900">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed line-clamp-3 flex-1">
                      {product.description.replace(/[#*`_~\[\]()]/g, '').substring(0, 120)}...
                    </p>

                    {/* Price and Stock Info */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-primary">
                          NPR {product.price.toFixed(2)}
                        </span>
                        {product.stock > 0 && (
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {product.stock} in stock
                          </span>
                        )}
                      </div>
                      
                      <button 
                        onClick={(e) => {
                          e.preventDefault()
                          const message = encodeURIComponent(`Hi, I'm interested in ${product.title}. Price: NPR ${product.price}`)
                          window.open(`https://wa.me/9779867756915?text=${message}`, '_blank')
                        }}
                        disabled={product.stock <= 0}
                        className={`w-full py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md ${
                          product.stock > 0
                            ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:shadow-lg transform hover:-translate-y-0.5'
                            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {product.stock > 0 ? (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Buy via WhatsApp
                          </>
                        ) : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {products.length === 0 ? 'No products available yet.' : 'No products found in this category.'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Shop Stats */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <FiPackage className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{products.length}</div>
              <div className="text-gray-600 dark:text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <FiShoppingCart className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {products.filter(p => p.stock > 0).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">In Stock</div>
            </div>
            <div className="text-center">
              <FiTag className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{categories.length - 1}</div>
              <div className="text-gray-600 dark:text-gray-400">Categories</div>
            </div>
            <div className="text-center">
              <FiDollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {products.filter(p => p.featured).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400">Featured</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
