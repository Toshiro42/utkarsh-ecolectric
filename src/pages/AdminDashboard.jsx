import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductForm from '../components/ProductForm'

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' | 'add' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null)

  async function loadProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setProducts(data)
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this product? This can\'t be undone.')) return
    await supabase.from('products').delete().eq('id', id)
    loadProducts()
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (view === 'add' || view === 'edit') {
    return (
      <div className="min-h-screen bg-wool">
        <div className="max-w-md mx-auto px-6 pt-8">
          <h1 className="font-display text-2xl text-ink">
            {view === 'add' ? 'Add a product' : 'Edit product'}
          </h1>
        </div>
        <ProductForm
          existing={view === 'edit' ? editingProduct : null}
          onDone={() => {
            setView('list')
            setEditingProduct(null)
            loadProducts()
          }}
          onCancel={() => {
            setView('list')
            setEditingProduct(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wool">
      <header className="max-w-2xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Your products</h1>
        <button onClick={handleLogout} className="text-sm font-body text-ink/50 underline">
          Log out
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 pb-6">
        <button
          onClick={() => setView('add')}
          className="w-full py-3.5 rounded-stitch bg-madder text-wool font-body font-medium text-base"
        >
          + Add product
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-6 pb-20 flex flex-col gap-3">
        {loading && <p className="text-center text-ink/50 font-body">Loading...</p>}
        {!loading && products.length === 0 && (
          <p className="text-center text-ink/50 font-body">No products yet — add your first one above.</p>
        )}

        {products.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 bg-white/60 border border-thread rounded-stitch p-3"
          >
            <div className="w-16 h-16 shrink-0 bg-thread/30 rounded-stitch overflow-hidden">
              {(p.image_urls?.[0] || p.image_url) && (
                <img src={p.image_urls?.[0] || p.image_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-ink truncate">{p.name}</p>
              <p className="text-sm font-body text-ink/60">
                ₹{p.price} · {p.category} {!p.available && '· hidden'}
              </p>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => { setEditingProduct(p); setView('edit') }}
                className="text-sm font-body text-sage underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-sm font-body text-madder underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
