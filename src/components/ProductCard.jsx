import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'

export default function ProductCard({ product }) {
  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER

  const waMessage = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} (₹${product.price}).`
  )
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`

  const image = product.image_urls?.[0] || product.image_url

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-thread/90 bg-thread/70 shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:-translate-y-1 hover:border-madder/50 hover:shadow-[0_18px_36px_rgba(93,205,9,0.12)]">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-wool/70">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-sm text-ink/30">
              no photo yet
            </div>
          )}
        </div>
      </Link>

      <div className="product-card-content flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <span className="font-body text-[10px] font-bold uppercase tracking-[0.18em] text-sage sm:text-xs">
          {product.category}
        </span>
        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 font-display text-xl leading-tight text-ink">
            {product.name}
          </h3>
        </Link>
        <div className="product-card-meta mt-auto flex items-end justify-between border-t border-thread/70 pt-4">
          <span className="product-card-price font-display text-2xl text-madder">₹{product.price}</span>
        </div>

        <div className="product-card-actions flex justify-end gap-2 pt-2">

          <Link
            to={`/product/${product.id}`}
            aria-label="More details"
            title="More details"
            className="product-card-action flex min-w-0 flex-1 items-center justify-center gap-1 rounded-full bg-sage text-wool transition-colors hover:bg-madder"
          >
            <span className="hidden sm:inline">More details</span>
            <span className="sm:hidden text-xs">More</span>
          </Link>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            title="WhatsApp"
            className="product-card-action flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-madder text-wool transition-colors hover:opacity-90"
          >
            <FaWhatsapp className="text-2xl" />
          </a>

        </div>
      </div>
    </article>
  )
}