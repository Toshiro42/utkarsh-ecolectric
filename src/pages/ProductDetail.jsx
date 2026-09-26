import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'

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

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    async function fetchProduct() {
      const { data, error } = await supabase
        .from('products')
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

  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER
  const igHandle = import.meta.env.VITE_INSTAGRAM_HANDLE
  const waMessage = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} (₹${product.price}).`
  )
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`
  const igLink = `https://ig.me/m/${igHandle}`

  const youTubeEmbed = product.video_url ? getYouTubeEmbedUrl(product.video_url) : null

  return (
    <div className="min-h-screen bg-wool">
      <div className="max-w-3xl mx-auto px-5 pt-6 pb-16">
        <Link to="/" className="inline-block text-sm font-body text-madder mb-5">
          ← Back to catalogue
        </Link>

        <div className="aspect-square w-full rounded-stitch overflow-hidden bg-thread/30 mb-3">
          {images.length > 0 ? (
            <img
              src={images[activeImage]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/30 font-display">
              no photo yet
            </div>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto">
            {images.map((url, i) => (
              <button
                key={url}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 shrink-0 rounded-stitch overflow-hidden border-2 ${i === activeImage ? 'border-madder' : 'border-transparent'
                  }`}
              >
                <img src={url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
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

        <span className="inline-block text-xs uppercase tracking-wide text-madder bg-mustard/50 px-2.5 py-1 rounded-full font-body font-semibold mb-2">
          {product.category}
        </span>
        <h1 className="font-display text-2xl sm:text-3xl text-ink mb-2">{product.name}</h1>
        <p className="font-display text-2xl text-madder font-medium mb-4">₹{product.price}</p>

        {product.description && (
          <p className="font-body text-ink/70 leading-relaxed mb-8 whitespace-pre-line">
            {product.description}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 text-sm font-body font-medium bg-sage text-white rounded-stitch py-3 hover:opacity-90 transition-opacity"
          >
            <FaWhatsapp className="text-base" /> Order on WhatsApp
          </a>
          <a
            href={igLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 text-sm font-body font-medium bg-madder text-white rounded-stitch py-3 hover:opacity-90 transition-opacity"
          >
            <FaInstagram className="text-base" /> Order on Instagram
          </a>
        </div>
      </div>
    </div>
  )
}