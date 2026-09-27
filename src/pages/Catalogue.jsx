import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'
import backgroundArt from '../assets/imagefinal.png'
import Navbar from '../components/Navbar'

export default function Catalogue() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false })

      if (!error) setProducts(data)
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const categories = ['All', ...new Set(products.map((p) => p.category))]
  const visible =
    activeCategory === 'All'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <div className="catalogue-page min-h-screen bg-wool text-ink">
      <Navbar />
      
      

      <nav className="relative z-10 max-w-6xl mx-auto px-5 pt-7 sm:px-8 sm:pt-9">
        <div className="flex flex-col gap-4 border-b border-thread/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-madder">Collection</p>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-2 font-body text-xs font-semibold transition-all duration-200 ${activeCategory === cat
                  ? 'border-madder bg-madder text-wool shadow-sm'
                  : 'border-thread bg-white/45 text-ink/65 hover:-translate-y-0.5 hover:border-madder hover:bg-white hover:text-madder'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-5 pb-20 pt-7 sm:px-8 sm:pt-9">
        {loading && (
          <p className="py-16 text-center font-body text-sm text-ink/50">Loading the shelf...</p>
        )}

        {!loading && visible.length === 0 && (
          <p className="py-16 text-center font-body text-sm text-ink/50">
            Nothing here yet — check back soon.
          </p>
        )}

        <div className="catalogue-grid grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </div>
  )
}