import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for using the ElectroPhobia website and content.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: June 2, 2026
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Use of the Site</h2>
              <p>
                The content on ElectroPhobia is provided for educational and informational purposes.
                You agree not to misuse the site, attempt unauthorized access, or interfere with its
                operation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Content and Intellectual Property</h2>
              <p>
                Unless otherwise noted, the content on this site belongs to ElectroPhobia or its
                respective owners. You may not reproduce or redistribute content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Third-Party Services</h2>
              <p>
                The site may use third-party services such as Google AdSense, analytics tools, and
                embedded content. Those services may collect and process data under their own policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">No Warranty</h2>
              <p>
                The site is provided as-is without warranties of any kind. We do not guarantee that all
                content is complete, current, or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
              <p>
                For questions about these terms, contact electrophobiatech@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}