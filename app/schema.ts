// Structured Data (JSON-LD) for SEO

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'ElectroPhobia',
  url: 'https://electrophobia.tech',
  logo: 'https://electrophobia.tech/favicon/web-app-manifest-512x512.png',
  description: 'Electronics mentorship, projects, and community platform for learning embedded systems, Arduino, IoT, and hardware development.',
  sameAs: [
    // Add your social media URLs here
    'https://github.com/prashantbhandary',
    'https://linkedin.com/in/prashant-bhandari',
    'https://twitter.com/electrophobia',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Customer Support',
    url: 'https://electrophobia.tech/contact',
  },
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'ElectroPhobia',
  url: 'https://electrophobia.tech',
  description: 'Electronics mentorship, projects, workshops, and community for embedded systems and hardware development.',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://electrophobia.tech/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Prashant Bhandari',
  url: 'https://electrophobia.tech',
  jobTitle: 'Electronics Engineer & Mentor',
  description: 'Experienced electronics engineer providing mentorship in embedded systems, IoT, and hardware development.',
  sameAs: [
    'https://github.com/prashantbhandary',
    'https://linkedin.com/in/prashant-bhandari',
  ],
}

// Course structured data for the ElectroLab bootcamp — enables rich results
// (course cards) in Google for "learn electronics" style searches.
export const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'ElectroPhobia Electronics & Robotics Bootcamp',
  description:
    'A free, structured 5-day electronics and robotics course plus a PCB-design track — from voltage and Ohm’s Law to sensors, motors, control systems, communication protocols, and designing a PCB in KiCad.',
  url: 'https://electrophobia.tech/lab/course',
  provider: {
    '@type': 'Organization',
    name: 'ElectroPhobia',
    url: 'https://electrophobia.tech',
    sameAs: ['https://www.instagram.com/electro.phobia/'],
  },
  inLanguage: 'en',
  isAccessibleForFree: true,
  educationalLevel: 'Beginner to Intermediate',
  about: ['Electronics', 'Robotics', 'Arduino', 'ESP32', 'Embedded Systems', 'PCB Design'],
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: 'online',
    courseWorkload: 'PT20H',
  },
}
