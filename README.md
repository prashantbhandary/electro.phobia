# ElectroPhobia

A modern, professional Next.js website for electronics mentorship, workshops, and community building.

## 🚀 Features

- **Home Page**: Engaging hero section with statistics and featured projects
- **Experiences**: Mentorship programs, workshops, and past achievements
- **Projects**: Filterable project gallery showcasing electronics innovations
- **Blogs**: Article listing with categories and search functionality
- **Contact**: Contact form with office information
- **About**: Mission, values, expertise areas, and journey timeline

## 🎨 Design

- **Primary Color**: #22C0B3 (Cyan/Turquoise)
- **Dark/Light Mode**: Automatic theme switching
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions with Framer Motion

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
electrophbia/
├── app/
│   ├── about/         # About page
│   ├── blogs/         # Blog listing and posts
│   ├── contact/       # Contact page
│   ├── experiences/   # Workshops & mentorship
│   ├── projects/      # Projects showcase
│   ├── globals.css    # Global styles
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/
│   ├── Header.tsx     # Navigation header
│   └── Footer.tsx     # Footer component
├── img/
│   ├── Dark_logo.jpg  # Logo for light theme
│   └── Light_logo.jpg # Logo for dark theme
└── public/            # Static assets
```

## 🎯 Pages Overview

### Home (`/`)
- Hero section with call-to-action
- Statistics showcase
- Key features
- Featured projects
- Newsletter signup

### Experiences (`/experiences`)
- Mentorship programs with details
- Upcoming workshops
- Past achievements timeline

### Projects (`/projects`)
- Filterable project gallery
- Project categories
- Technology tags
- Links to demos and code

### Blogs (`/blogs`)
- Article listing
- Category filtering
- Search functionality
- Featured articles

### Contact (`/contact`)
- Contact form
- Office information
- Social media links
- Office hours

### About (`/about`)
- Mission and vision
- Core values
- Expertise areas
- Journey timeline
- Founder information

## 🎨 Customization

### Update Colors
Edit `tailwind.config.ts` to change the primary color theme:

```typescript
colors: {
  primary: {
    DEFAULT: '#22C0B3',
    // ... other shades
  },
}
```

### Update Content
- **Header Navigation**: Edit `components/Header.tsx`
- **Footer Links**: Edit `components/Footer.tsx`
- **Page Content**: Edit respective files in `app/` directory

## 📱 Features to Add Later

- Blog post CMS integration
- Project detail pages
- User authentication for mentorship applications
- Payment integration for workshops
- Admin dashboard
- Email newsletter integration

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Other Platforms
```bash
npm run build
npm start
```

## 📄 License

All rights reserved © 2026 ElectroPhobia

## 🤝 Contributing

This is a personal project. For suggestions or issues, please contact through the website.

---

Built with ❤️ for the electronics community
