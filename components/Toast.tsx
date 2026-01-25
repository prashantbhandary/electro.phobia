'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info' | 'warning'
  duration?: number
  onClose: () => void
  isVisible: boolean
}

export default function Toast({ 
  message, 
  type = 'success', 
  duration = 3000, 
  onClose,
  isVisible 
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const icons = {
    success: <FiCheckCircle className="w-6 h-6" />,
    error: <FiXCircle className="w-6 h-6" />,
    info: <FiInfo className="w-6 h-6" />,
    warning: <FiAlertCircle className="w-6 h-6" />,
  }

  const styles = {
    success: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white',
    error: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    info: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] max-w-md w-full mx-4"
        >
          <div className={`${styles[type]} rounded-2xl shadow-2xl backdrop-blur-lg border border-white/20 overflow-hidden`}>
            {/* Animated background shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear"
              }}
            />
            
            <div className="relative px-6 py-4 flex items-center gap-4">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200
                }}
                className="flex-shrink-0"
              >
                {icons[type]}
              </motion.div>
              
              <p className="flex-1 font-medium text-base">
                {message}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                className="h-1 bg-white/30"
                initial={{ scaleX: 1 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: duration / 1000, ease: "linear" }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
