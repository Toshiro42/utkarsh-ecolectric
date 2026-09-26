import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import ProductForm from '../components/ProductForm'

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('list') // 'list' | 'add' | 'edit'
  const [editingVehicle, setEditingVehicle] = useState(null)

  async function loadVehicles() {
    setLoading(true)
    const { data, error } = await supabase
      .from('vehicle')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setVehicles(data)
    setLoading(false)
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this vehicle? This can\'t be undone.')) return
    await supabase.from('vehicle').delete().eq('id', id)
    loadVehicles()
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
            {view === 'add' ? 'Add a vehicle' : 'Edit vehicle'}
          </h1>
        </div>
        <ProductForm
          existing={view === 'edit' ? editingVehicle : null}
          onDone={() => {
            setView('list')
            setEditingVehicle(null)
            loadVehicles()
          }}
          onCancel={() => {
            setView('list')
            setEditingVehicle(null)
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-wool">
      <header className="max-w-2xl mx-auto px-6 pt-10 pb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl text-ink">Your vehicles</h1>
        <button onClick={handleLogout} className="text-sm font-body text-ink/50 underline">
          Log out
        </button>
      </header>

      <div className="max-w-2xl mx-auto px-6 pb-6">
        <button
          onClick={() => setView('add')}
          className="w-full py-3.5 rounded-stitch bg-madder text-wool font-body font-medium text-base"
        >
          + Add vehicle
        </button>
      </div>

      <main className="max-w-2xl mx-auto px-6 pb-20 flex flex-col gap-3">
        {loading && <p className="text-center text-ink/50 font-body">Loading...</p>}
        {!loading && vehicles.length === 0 && (
          <p className="text-center text-ink/50 font-body">No vehicles yet — add your first one above.</p>
        )}

        {vehicles.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-4 bg-white/60 border border-thread rounded-stitch p-3"
          >
            <div className="w-16 h-16 shrink-0 bg-thread/30 rounded-stitch overflow-hidden">
              {v.image_urls?.[0] && (
                <img src={v.image_urls[0]} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-ink truncate">{v.name}</p>
              <p className="text-sm font-body text-ink/60">
                ₹{v.price} · {v.category} {!v.available && '· hidden'}
              </p>
              {(v.range_km || v.top_speed_kmh) && (
                <p className="text-xs font-body text-ink/40">
                  {v.range_km ? `${v.range_km} km range` : ''}
                  {v.range_km && v.top_speed_kmh ? ' · ' : ''}
                  {v.top_speed_kmh ? `${v.top_speed_kmh} km/h top speed` : ''}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <button
                onClick={() => { setEditingVehicle(v); setView('edit') }}
                className="text-sm font-body text-sage underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(v.id)}
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