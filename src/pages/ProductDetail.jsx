import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { FaWhatsapp } from 'react-icons/fa'

function getYouTubeEmbedUrl(url) {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v')
      if (id) return `https://www.youtube.com/embed/${id}`
    }
  } catch {
    return null
  }
  return null
}

function formatSpecificationValue(key, value) {
  if (key === 'top_speed') return `${value} km/h`
  if (key === 'range') return `${value} km`
  return value
}

function formatRange(range) {
  return /km/i.test(range) ? range : `${range} km`
}

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [activeBattery, setActiveBattery] = useState(null)

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('vehicle')
        .select('*')
        .eq('id', id)
        .single()

      if (!error) setProduct(data)
      setLoading(false)
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-wool flex items-center justify-center">
        <p className="font-body text-ink/50">Loading...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-wool flex flex-col items-center justify-center gap-4">
        <p className="font-body text-ink/50">Product not found.</p>
        <Link to="/" className="text-madder underline font-body">Back to catalogue</Link>
      </div>
    )
  }

  const images = product.image_urls?.length
    ? product.image_urls
    : product.image_url
      ? [product.image_url]
      : []
  const displayedImage = images[activeImage]

  function showPreviousImage() {
    setActiveImage((current) => (current - 1 + images.length) % images.length)
  }

  function showNextImage() {
    setActiveImage((current) => (current + 1) % images.length)
  }

  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER
  const waMessage = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} (₹${product.price}).`
  )
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`

  const youTubeEmbed = product.video_url ? getYouTubeEmbedUrl(product.video_url) : null
  const rangeRows = Object.values(product.price_options || {})
    .flat()
    .filter((row) => parseInt(row.range))
    .sort((a, b) => parseInt(a.range) - parseInt(b.range))

  const clean = (r) => r.range.replace(/\s*km\s*$/i, '').trim()
  const low = rangeRows.length ? clean(rangeRows[0]) : null
  const high = rangeRows.length ? clean(rangeRows[rangeRows.length - 1]) : null
  const autoRange = low ? (low === high ? low : `${low} - ${high}`) : null

  const specifications = {
    ...(product.specifications || {}),
    ...(autoRange ? { range: autoRange } : {}),
  }
  const batteryKeys = Object.keys(product.price_options || {})
  const selectedBattery = batteryKeys.includes(activeBattery) ? activeBattery : batteryKeys[0]
  const primarySpecs = [
    ['top_speed', 'Top speed'],
    ['range', 'Range'],
    ['battery_type', 'Battery type'],
  ].filter(([key]) => specifications[key])
  const otherSpecs = String(specifications.other_specs || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-wool">
      <div className="w-full max-w-5xl min-w-0 mx-auto px-5 pt-6 pb-16 overflow-x-hidden">
        <Link to="/" className="inline-block text-sm font-body text-madder mb-5">
          ← Back to catalogue
        </Link>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)] lg:items-start mb-5 lg:mb-8">
          <section className="min-w-0 w-full" aria-label="Product detail photos">
            <div className="relative aspect-[4/3] overflow-hidden rounded-stitch bg-[#F4F5F1]">
              {displayedImage ? (
                <img key={displayedImage} src={displayedImage} alt={product.name} className="h-full w-full object-contain p-5 sm:p-10" />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-display text-ink/30">no photo yet</div>
              )}
              {images.length > 1 && (
                <>
                  <span className="absolute inset-y-0 left-3 flex items-center">
                    <button type="button" onClick={showPreviousImage} aria-label="Previous product photo" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-wool/80 pb-0.5 text-2xl leading-none text-ink hover:bg-madder hover:text-wool">‹</button>
                  </span>
                  <span className="absolute inset-y-0 right-3 flex items-center">
                    <button type="button" onClick={showNextImage} aria-label="Next product photo" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-wool/80 pb-0.5 text-2xl leading-none text-ink hover:bg-madder hover:text-wool">›</button>
                  </span>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((url, index) => (
                  <button key={url} type="button" onClick={() => setActiveImage(index)} className={`h-20 w-24 shrink-0 overflow-hidden rounded-stitch border-2 bg-thread/30 ${index === activeImage ? 'border-madder' : 'border-transparent'}`}>
                    <img src={url} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <div className="min-w-0">
            <div className="lg:mb-8">
              <span className="inline-block text-xs uppercase tracking-wide text-madder bg-mustard/50 px-2.5 py-1 rounded-full font-body font-semibold mb-2">
                {product.category}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl text-ink mb-2">{product.name}</h1>
            </div>

            {primarySpecs.length > 0 && (
              <aside className="hidden gap-3 lg:grid lg:grid-cols-[repeat(auto-fit,minmax(120px,1fr))]" aria-label="Product specifications">
                {primarySpecs.map(([key, label], index) => (
                  <div key={key} className="spec-highlight min-w-0 border-l-2 border-madder/70 bg-thread/30 px-4 py-4" style={{ '--spec-delay': `${index * 90}ms` }}>
                    <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/45">{label}</span>
                    <strong className="mt-2 block break-words font-display text-base leading-snug text-ink">{formatSpecificationValue(key, specifications[key])}</strong>
                  </div>
                ))}
              </aside>
            )}
            {otherSpecs.length > 0 && (
              <aside className="mt-6 hidden lg:block" aria-label="Other specifications">
                <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-madder">Other specifications</p>
                <ul className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
                  {otherSpecs.map((spec) => (
                    <li key={spec} className="border-b border-thread/70 py-2 font-body text-sm text-ink/75">{spec}</li>
                  ))}
                </ul>
              </aside>
            )}
          </div>
        </div>

        {product.price_options && Object.keys(product.price_options).length > 0 && (
          <div className="mb-8">
            <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-madder">Pricing</p>


            {/* Phone / tablet: tabs + one table */}
            <div className="lg:hidden">
              <div className="mb-3 grid grid-cols-2 gap-2 rounded-stitch bg-thread/30 p-1">
                {batteryKeys.map((battery) => (
                  <button
                    key={battery}
                    type="button"
                    onClick={() => setActiveBattery(battery)}
                    className={`rounded-stitch py-2 font-body text-sm font-semibold transition-colors ${battery === selectedBattery ? 'bg-madder text-wool' : 'text-ink/60'
                      }`}
                  >
                    {battery}
                  </button>
                ))}
              </div>
              <div className="rounded-stitch border border-thread overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-thread/20">
                      <th className="text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/50 px-4 py-2">Range</th>
                      <th className="text-right font-body text-xs font-semibold uppercase tracking-wide text-ink/50 px-4 py-2">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.price_options[selectedBattery].map((row) => (
                      <tr key={row.range} className="border-t border-thread/50">
                        <td className="font-body text-sm text-ink px-4 py-2.5">{formatRange(row.range)}</td>
                        <td className="font-body text-sm font-semibold text-madder px-4 py-2.5 text-right">₹{row.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PC: both tables side by side */}
            <div className="hidden gap-4 lg:grid lg:grid-cols-2">
              {Object.entries(product.price_options).map(([battery, rows]) => (
                <div key={battery} className="rounded-stitch border border-thread overflow-hidden">
                  <p className="bg-mustard/60 px-4 py-2 font-body text-sm font-semibold text-ink">
                    {battery} battery
                  </p>
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-thread/20">
                        <th className="text-left font-body text-xs font-semibold uppercase tracking-wide text-ink/50 px-4 py-2">Range</th>
                        <th className="text-right font-body text-xs font-semibold uppercase tracking-wide text-ink/50 px-4 py-2">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.range} className="border-t border-thread/50">
                          <td className="font-body text-sm text-ink px-4 py-2.5">{formatRange(row.range)}</td>
                          <td className="font-body text-sm font-semibold text-madder px-4 py-2.5 text-right">₹{row.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        {primarySpecs.length > 0 && (
          <aside className="mb-6 grid gap-3 sm:grid-cols-[repeat(auto-fit,minmax(120px,1fr))] lg:hidden" aria-label="Product specifications">
            {primarySpecs.map(([key, label], index) => (
              <div key={key} className="spec-highlight min-w-0 border-l-2 border-madder/70 bg-thread/30 px-4 py-4" style={{ '--spec-delay': `${index * 90}ms` }}>
                <span className="block font-body text-[10px] font-semibold uppercase tracking-[0.15em] text-ink/45">{label}</span>
                <strong className="mt-2 block break-words font-display text-base leading-snug text-ink">{formatSpecificationValue(key, specifications[key])}</strong>
              </div>
            ))}
          </aside>
        )}

        {/* Phone / tablet only: other specs below pricing */}
        {otherSpecs.length > 0 && (
          <aside className="mb-8 lg:hidden" aria-label="Other specifications">
            <p className="mb-3 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-madder">Other specifications</p>
            <ul className="grid gap-x-5 gap-y-2 sm:grid-cols-2">
              {otherSpecs.map((spec) => (
                <li key={spec} className="border-b border-thread/70 py-2 font-body text-sm text-ink/75">{spec}</li>
              ))}
            </ul>
          </aside>
        )}

        {youTubeEmbed && (
          <div className="aspect-video w-full rounded-stitch overflow-hidden mb-6">
            <iframe
              src={youTubeEmbed}
              title="Product video"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}

        {!youTubeEmbed && product.video_url && (
          <a
            href={product.video_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mb-6 text-sm font-body text-madder underline"
          >
            ▶ Watch video
          </a>
        )}

        {product.description && (
          <p className="mb-8 font-body leading-relaxed text-ink/70 whitespace-pre-line">
            {product.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 text-sm font-body font-medium bg-madder text-white rounded-stitch py-3 hover:opacity-90 transition-opacity"
          >
            <FaWhatsapp className="text-base" /> Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}