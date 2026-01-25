'use client'

import { motion } from 'framer-motion'
import { FiZap } from 'react-icons/fi'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizes = {
    sm: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-sm' },
    md: { container: 'w-20 h-20', icon: 'w-10 h-10', text: 'text-base' },
    lg: { container: 'w-32 h-32', icon: 'w-16 h-16', text: 'text-xl' },
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8">
      {/* Animated electric circle */}
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className={`${sizes[size].container} rounded-full border-4 border-primary-200 dark:border-primary-900 border-t-primary-500`}
        />
        
        {/* Middle pulsing ring */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-0 rounded-full border-2 border-primary-400/50`}
        />

        {/* Electric bolt icon */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <FiZap className={`${sizes[size].icon} text-primary-500`} />
        </motion.div>

        {/* Glowing effect */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3] 
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute inset-0 rounded-full bg-primary-500/20 blur-xl`}
        />
      </div>

      {/* Loading text with animated dots */}
      <div className="flex items-center gap-1">
        <motion.p 
          className={`${sizes[size].text} font-medium text-gray-700 dark:text-gray-300`}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.p>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                y: [0, -4, 0]
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2
              }}
              className={`${sizes[size].text} text-primary-500 font-bold`}
            >
              .
            </motion.span>
          ))}
        </div>
      </div>

      {/* Electric particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary-400 rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos(i * 60 * Math.PI / 180) * 60],
              y: [0, Math.sin(i * 60 * Math.PI / 180) * 60],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
