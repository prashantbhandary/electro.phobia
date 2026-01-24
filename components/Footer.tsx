import Link from 'next/link'
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiYoutube } from 'react-icons/fi'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Quick Links': [
      { name: 'Home', path: '/' },
      { name: 'Experiences', path: '/experiences' },
      { name: 'Projects', path: '/projects' },
      { name: 'Blogs', path: '/blogs' },
    ],
    'About': [
      { name: 'About Electronics', path: '/about' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'Mentorship', path: '/experiences#mentorship' },
      { name: 'Workshops', path: '/experiences#workshops' },
    ],
  }

  const socialLinks = [
    { icon: FiGithub, href: 'https://github.com/prashantbhandary', label: 'GitHub' },
    { icon: FiLinkedin, href: 'https://www.linkedin.com/in/prashantbdri', label: 'LinkedIn' },
    { icon: FiInstagram, href: 'https://www.instagram.com/_prashant.08/', label: 'Instagram' },
    { icon: FiYoutube, href: '#', label: 'YouTube' },
    { icon: FiMail, href: '/contact', label: 'Email' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              Electro<span className="text-primary">Phobia</span>
            </h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering electronics enthusiasts through mentorship, workshops, and community-driven learning. 
              Join us to explore the fascinating world of hardware, embedded systems, and innovation.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-primary hover:text-white transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.path}
                      className="text-gray-400 hover:text-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} ElectroPhobia. All rights reserved. Created by{' '}
              <a 
                href="https://bhandari-prashant.com.np/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-600 transition-colors"
              >
                Prashant Bhandari
              </a>
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
