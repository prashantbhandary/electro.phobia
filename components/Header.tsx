'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Shop', path: '/shop' },
  ]

  // Determine text color based on scroll and page
  const isHomePage = pathname === '/'
  const textColorClass = (scrolled || !isHomePage) 
    ? 'text-gray-700 dark:text-gray-300' 
    : 'text-white'
  const logoTextClass = (scrolled || !isHomePage)
    ? 'text-gray-900 dark:text-white'
    : 'text-white'

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/img/Logo.png"
                alt="ElectroPhobia Logo"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>
            <span className={`text-2xl font-bold ${logoTextClass} group-hover:text-primary transition-colors`}>
              Electro<span className="text-primary">Phobia</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              // Special styling for Shop button
              if (link.name === 'Shop') {
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ml-2 transform ${
                      pathname === link.path
                        ? 'bg-primary text-white shadow-lg scale-105'
                        : 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-xl hover:scale-110 hover:-translate-y-0.5'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              }
              
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    pathname === link.path
                      ? 'text-primary bg-primary/10'
                      : `${textColorClass} hover:text-primary hover:bg-primary/5`
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <FiSun className={`w-5 h-5 ${scrolled || !isHomePage ? 'text-gray-300' : 'text-white'}`} />
              ) : (
                <FiMoon className={`w-5 h-5 ${scrolled || !isHomePage ? 'text-gray-700' : 'text-white'}`} />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FiX className={`w-6 h-6 ${scrolled || !isHomePage ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`} />
              ) : (
                <FiMenu className={`w-6 h-6 ${scrolled || !isHomePage ? 'text-gray-700 dark:text-gray-300' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                // Special styling for Shop button in mobile
                if (link.name === 'Shop') {
                  return (
                    <Link
                      key={link.path}
                      href={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 transform ${
                        pathname === link.path
                          ? 'bg-primary text-white shadow-lg scale-105'
                          : 'bg-primary text-white hover:bg-primary/90 hover:shadow-xl hover:scale-105'
                      }`}
                    >
                      {link.name}
                    </Link>
                  )
                }
                
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      pathname === link.path
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
