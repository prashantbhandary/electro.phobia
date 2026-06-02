import { ImageResponse } from 'next/og'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Shared Open Graph card renderer used by the per-section opengraph-image.tsx
// files. Produces a branded 1200x630 card so links shared on Facebook /
// Messenger / Instagram / X look like they come from that specific section
// instead of all showing the same logo.

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

const BRAND_TEAL = '#22C0B3'
const BG_DARK = '#0B0F0E'

let logoCache: string | null = null
async function getLogoDataUri(): Promise<string> {
  if (logoCache !== null) return logoCache
  try {
    const data = await readFile(join(process.cwd(), 'public', 'img', 'Logo.png'))
    logoCache = `data:image/png;base64,${data.toString('base64')}`
  } catch {
    logoCache = ''
  }
  return logoCache
}

export interface OgCardOptions {
  /** Small uppercase label, e.g. "ElectroLab · Course". */
  eyebrow?: string
  /** Main headline. */
  title: string
  /** Optional supporting line under the title. */
  subtitle?: string
  /** Absolute URL of a content photo (e.g. blog cover) to use as background. */
  bgImage?: string
}

export async function renderOgCard({ eyebrow, title, subtitle, bgImage }: OgCardOptions) {
  const logo = await getLogoDataUri()
  const hasPhoto = Boolean(bgImage)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: BG_DARK,
          padding: '64px 72px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Content photo as full-bleed background with dark overlay */}
        {hasPhoto && (
          <img
            src={bgImage}
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        )}
        {hasPhoto && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background:
                'linear-gradient(90deg, rgba(7,11,10,0.96) 0%, rgba(7,11,10,0.86) 45%, rgba(7,11,10,0.55) 100%)',
            }}
          />
        )}

        {/* Teal accent glow (branded cards only) */}
        {!hasPhoto && (
          <div
            style={{
              position: 'absolute',
              top: -160,
              right: -160,
              width: 520,
              height: 520,
              borderRadius: 520,
              background: BRAND_TEAL,
              opacity: 0.18,
              filter: 'blur(40px)',
            }}
          />
        )}

        {/* Header: logo + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {logo ? (
            <img src={logo} width={64} height={64} style={{ borderRadius: 14 }} />
          ) : null}
          <span
            style={{
              marginLeft: 18,
              fontSize: 30,
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: 1,
            }}
          >
            ElectroPhobia
          </span>
        </div>

        {/* Main text block */}
        <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', maxWidth: 980 }}>
          {eyebrow ? (
            <span
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: BRAND_TEAL,
                textTransform: 'uppercase',
                letterSpacing: 3,
                marginBottom: 20,
              }}
            >
              {eyebrow}
            </span>
          ) : null}
          <span
            style={{
              fontSize: title.length > 60 ? 60 : 74,
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.05,
            }}
          >
            {title}
          </span>
          {subtitle ? (
            <span
              style={{
                marginTop: 24,
                fontSize: 30,
                color: '#C9D6D2',
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </span>
          ) : null}
        </div>

        {/* Footer: accent bar + domain */}
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <div style={{ width: 56, height: 6, borderRadius: 6, background: BRAND_TEAL }} />
          <span style={{ marginLeft: 20, fontSize: 26, color: '#8FA39D' }}>electrophobia.tech</span>
        </div>
      </div>
    ),
    { ...OG_SIZE }
  )
}

// Decide whether a content image is fetchable by social scrapers.
// Facebook CDN blocks hot-linking and Notion-hosted images are usually
// inaccessible to the scraper, so we render a branded card instead.
export function isUsableSocialImage(url?: string | null): url is string {
  if (!url) return false
  if (!url.startsWith('http')) return false
  if (url.includes('fbcdn.net')) return false
  if (url.includes('notion.site') || url.includes('notion.so')) return false
  return true
}
