import { Link } from 'react-router-dom'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'

export default function ProductCard({ product }) {
  const waNumber = import.meta.env.VITE_WHATSAPP_NUMBER
  const igHandle = import.meta.env.VITE_INSTAGRAM_HANDLE

  const waMessage = encodeURIComponent(
    `Hi! I'm interested in the ${product.name} (₹${product.price}).`
  )
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`
  const igLink = `https://ig.me/m/${igHandle}`

  const image = product.image_urls?.[0] || product.image_url

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-thread/80 bg-white/75 shadow-[0_10px_30px_rgba(101,0,30,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(101,0,30,0.12)]">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-thread/30">
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
        {product.description && (
          <p className="product-description line-clamp-2 font-body text-sm leading-6 text-ink/60">
            {product.description}
          </p>
        )}
        <div className="product-card-meta mt-auto flex items-end justify-between border-t border-thread/70 pt-4">
          <span className="product-card-price font-display text-2xl text-madder">₹{product.price}</span>
        </div>

        <div className="product-card-actions flex justify-end gap-2 pt-2">

          <a href={waLink} target="_blank" rel="noopener noreferrer" aria-label="Contact on WhatsApp" title="WhatsApp" className="product-card-action flex min-w-0 flex-1 items-center justify-center rounded-full bg-sage text-wool transition-colors hover:bg-madder"><FaWhatsapp className="text-base" /></a>

          <a href={igLink} target="_blank" rel="noopener noreferrer" aria-label="View on Instagram" title="Instagram" className="product-card-action flex min-w-0 flex-1 items-center justify-center rounded-full border border-madder text-madder transition-colors hover:bg-madder hover:text-wool"><FaInstagram className="text-base" /></a>

        </div>
      </div>
    </article>
  )
}