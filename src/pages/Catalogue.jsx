import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductCard from '../components/ProductCard'
import Navbar from '../components/Navbar'

export default function Catalogue() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOrder, setSortOrder] = useState('default')

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase
        .from('vehicle')
        .select('*')
        .eq('available', true)
        .order('created_at', { ascending: false })

      if (!error) {
        setProducts(data || [])
      }

      setLoading(false)
    }

    fetchProducts()
  }, [])

  // Sort products by price without modifying the original array.
  const visible = [...products].sort((a, b) => {
    const priceA = Number(a.price) || 0
    const priceB = Number(b.price) || 0

    if (sortOrder === 'price-low-high') {
      return priceA - priceB
    }

    if (sortOrder === 'price-high-low') {
      return priceB - priceA
    }

    return 0
  })

  return (
    <div className="catalogue-page min-h-screen bg-wool text-ink">
      <Navbar />

      {/* Catalogue header and sorting dropdown */}
      <nav className="relative z-10 max-w-6xl mx-auto px-5 pt-7 sm:px-8 sm:pt-9">
        <div className="flex flex-col gap-4 border-b border-thread/70 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-madder">
              Collection
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="catalogue-sort"
              className="font-body text-xs font-semibold uppercase tracking-[0.15em] text-ink/55"
            >
              Sort
            </label>

            <select
            id="catalogue-sort"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            aria-label="Sort scooters by price"
            className="min-w-[185px] cursor-pointer appearance-none rounded-full border border-[#303a33] bg-[#101713] px-4 py-2.5 pr-9 font-body text-xs font-semibold text-[#f5f1e8] shadow-sm outline-none transition-colors hover:border-[#4ADE20] focus:border-[#4ADE20] focus:outline-none focus:ring-2 focus:ring-[#4ADE20]/30"
            style={{
              backgroundImage:
              `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23d6d8ce' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 14px center',
              colorScheme: 'dark',
              }}
              >
                <option value="default">Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                </select>
          </div>
        </div>
      </nav>

      {/* Scooter catalogue */}
      <main className="relative z-10 max-w-6xl mx-auto px-5 pb-20 pt-7 sm:px-8 sm:pt-9">
        {loading && (
          <p className="py-16 text-center font-body text-sm text-ink/50">
            Loading the shelf...
          </p>
        )}

        {!loading && visible.length === 0 && (
          <p className="py-16 text-center font-body text-sm text-ink/50">
            Nothing here yet — check back soon.
          </p>
        )}

        <div className="catalogue-grid grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
          {visible.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </main>
    </div>
  )
}