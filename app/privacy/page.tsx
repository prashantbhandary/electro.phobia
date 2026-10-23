import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for ElectroPhobia, including cookies, analytics, and advertising disclosures.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-20">
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last updated: June 2, 2026
          </p>

          <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Overview</h2>
              <p>
                ElectroPhobia respects your privacy. This page explains what information we may collect,
                how we use it, and how third-party services such as Google AdSense may use cookies or
                similar technologies on our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Information We Collect</h2>
              <p>
                We may collect information you voluntarily provide through contact forms, newsletter
                signups, or other interactions on the site. We may also collect limited technical data
                such as browser type, device information, and pages visited for analytics and site
                improvement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Cookies and Advertising</h2>
              <p>
                Google AdSense and other third-party vendors may use cookies to serve ads based on prior
                visits to this site or other websites. These cookies help measure ad performance and show
                more relevant ads.
              </p>
              <p className="mt-3">
                Google&apos;s use of advertising cookies enables it and its partners to serve ads to you
                based on your visits to this site and/or other sites on the Internet. You may opt out of
                personalised advertising by visiting{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  Google Ads Settings
                </a>
                , or opt out of some third-party vendors&apos; use of cookies for personalised advertising at{' '}
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  aboutads.info
                </a>
                .
              </p>
              <p className="mt-3">
                You can also manage cookies through your browser settings. To learn how Google uses
                information from sites that use its services, see{' '}
                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  How Google uses information from sites or apps that use our services
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">How We Use Information</h2>
              <p>
                We use information to respond to inquiries, improve the site, understand usage patterns,
                and support advertising and analytics features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
              <p>
                If you have questions about this policy, please contact us at electrophobiatech@gmail.com.
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  )
}