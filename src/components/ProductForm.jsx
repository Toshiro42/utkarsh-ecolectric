import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = ['Scooter', 'E-Rickshaw']
const MAX_IMAGES = 5
const BATTERY_TYPES = ['Lithium', 'Graphene']

function removeUnit(value, unit) {
  return String(value || '').replace(new RegExp(`\\s*${unit}\\s*$`, 'i'), '').trim()
}

function buildInitialOptions(existingOptions) {
  const initial = {}
  for (const battery of BATTERY_TYPES) {
    initial[battery] = (existingOptions?.[battery] || []).map((row) => ({
      range: row.range || '',
      price: row.price ?? '',
    }))
  }
  return initial
}

export default function ProductForm({ existing, onDone, onCancel }) {
  const [name, setName] = useState(existing?.name || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [category, setCategory] = useState(existing?.category || CATEGORIES[0])
  const [available, setAvailable] = useState(existing?.available ?? true)
  const [videoUrl, setVideoUrl] = useState(existing?.video_url || '')

  const [priceOptions, setPriceOptions] = useState(buildInitialOptions(existing?.price_options))

  const [specifications, setSpecifications] = useState({
    top_speed: removeUnit(existing?.specifications?.top_speed, 'km/h'),
    other_specs: existing?.specifications?.other_specs || '',
  })
  const [existingImages, setExistingImages] = useState(existing?.image_urls || [])
  const [newFiles, setNewFiles] = useState([])

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const totalCount = existingImages.length + newFiles.length
  const slotsLeft = MAX_IMAGES - totalCount

  function handleImagePick(e) {
    const picked = Array.from(e.target.files || [])
    if (picked.length === 0) return
    const allowed = picked.slice(0, slotsLeft)
    setNewFiles((prev) => [...prev, ...allowed])
    e.target.value = ''
  }

  function removeExistingImage(url) {
    setExistingImages((prev) => prev.filter((u) => u !== url))
  }

  function removeNewFile(index) {
    setNewFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function updateSpecification(key, value) {
    setSpecifications((current) => ({ ...current, [key]: value }))
  }

  function addPriceRow(battery) {
    setPriceOptions((current) => ({
      ...current,
      [battery]: [...current[battery], { range: '', price: '' }],
    }))
  }

  function updatePriceRow(battery, index, field, value) {
    setPriceOptions((current) => ({
      ...current,
      [battery]: current[battery].map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      ),
    }))
  }

  function removePriceRow(battery, index) {
    setPriceOptions((current) => ({
      ...current,
      [battery]: current[battery].filter((_, i) => i !== index),
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const uploadedUrls = []
      for (const file of newFiles) {
        const ext = file.name.split('.').pop()
        const path = `${crypto.randomUUID()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('vehicle-images')
          .upload(path, file)
        if (uploadError) throw uploadError

        const { data: publicUrlData } = supabase.storage
          .from('vehicle-images')
          .getPublicUrl(path)
        uploadedUrls.push(publicUrlData.publicUrl)
      }

      const image_urls = [...existingImages, ...uploadedUrls]

      const cleanOptions = {}
      const allPrices = []
      for (const battery of BATTERY_TYPES) {
        const rows = priceOptions[battery]
          .filter((row) => row.range.trim() !== '' && row.price !== '')
          .map((row) => ({ range: row.range.trim(), price: Number(row.price) }))
        if (rows.length > 0) {
          cleanOptions[battery] = rows
          rows.forEach((r) => allPrices.push(r.price))
        }
      }

      if (allPrices.length === 0) {
        throw new Error('Add at least one range and price.')
      }

      const payload = {
        name,
        price: Math.min(...allPrices),
        description,
        category,
        available,
        image_urls,
        video_url: videoUrl.trim() || null,
        price_options: cleanOptions,
        specifications: {
          top_speed: specifications.top_speed.trim(),
          other_specs: specifications.other_specs.trim(),
        },
      }

      if (existing) {
        const { error: updateError } = await supabase
          .from('vehicle')
          .update(payload)
          .eq('id', existing.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('vehicle').insert(payload)
        if (insertError) throw insertError
      }

      onDone()
    } catch (err) {
      setError(err.message || 'Something went wrong saving this. Try again.')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-5 p-6">
      <div>
        <label className="block text-sm font-body text-ink/70 mb-2">
          Product detail photos (up to {MAX_IMAGES})
        </label>
        <p className="mb-3 font-body text-xs text-ink/50">
          Add front, side, tyre, handle, dashboard, or other detail photos here.
        </p>
        <div className="flex flex-wrap gap-2">
          {existingImages.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-stitch overflow-hidden border border-thread">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-0.5 right-0.5 bg-madder text-white rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center">×</button>
            </div>
          ))}
          {newFiles.map((file, i) => (
            <div key={i} className="relative w-20 h-20 rounded-stitch overflow-hidden border border-thread">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => removeNewFile(i)} className="absolute top-0.5 right-0.5 bg-madder text-white rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center">×</button>
            </div>
          ))}
          {slotsLeft > 0 && (
            <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-thread rounded-stitch cursor-pointer bg-white/50 text-ink/40 text-xs text-center px-1">
              + Add
              <input type="file" accept="image/*" multiple onChange={handleImagePick} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-body text-ink/70 mb-1">Name</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Mantra Urban 100" className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none" />
      </div>

      <div>
        <label className="block text-sm font-body text-ink/70 mb-1">Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none">
          {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
        </select>
      </div>

      <div className="flex flex-col gap-5 border-t border-thread/70 pt-5">
        <h2 className="font-display text-xl text-ink">Pricing</h2>
        <p className="font-body text-xs text-ink/50 -mt-3">
          Leave a battery type with no rows if it's not offered for this vehicle.
        </p>

        {BATTERY_TYPES.map((battery) => (
          <div key={battery} className="flex flex-col gap-2">
            <h3 className="font-body text-sm font-semibold text-ink">{battery}</h3>

            {priceOptions[battery].map((row, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  value={row.range}
                  onChange={(e) => updatePriceRow(battery, index, 'range', e.target.value)}
                  placeholder="Range, e.g. 40 km"
                  className="flex-1 px-3 py-2.5 border border-thread rounded-stitch bg-white font-body text-sm focus:border-madder outline-none"
                />
                <input
                  type="number"
                  min="0"
                  value={row.price}
                  onChange={(e) => updatePriceRow(battery, index, 'price', e.target.value)}
                  placeholder="Price"
                  className="w-28 px-3 py-2.5 border border-thread rounded-stitch bg-white font-body text-sm focus:border-madder outline-none"
                />
                <button
                  type="button"
                  onClick={() => removePriceRow(battery, index)}
                  className="text-madder text-sm font-body px-2"
                >
                  ×
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addPriceRow(battery)}
              className="self-start text-sm font-body text-sage underline"
            >
              + Add range & price
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-5 border-t border-thread/70 pt-5">
        <h2 className="font-display text-xl text-ink">Other specifications</h2>
        <div className="grid gap-3">
          <label className="font-body text-sm text-ink/70">
            Top speed
            <span className="relative mt-1 block">
              <input value={specifications.top_speed} onChange={(e) => updateSpecification('top_speed', e.target.value)} placeholder="65" className="w-full px-3 py-3 pr-16 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-body text-sm text-ink/45">km/h</span>
            </span>
          </label>
          <label className="font-body text-sm text-ink/70">
            Other specs
            <textarea value={specifications.other_specs} onChange={(e) => updateSpecification('other_specs', e.target.value)} rows={3} placeholder="Digital Meter, LED Headlight, Alloy Wheels, USB Charging Port" className="mt-1 w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none" />
            <span className="mt-1 block text-xs text-ink/50">Separate each item with a comma.</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-body text-ink/70 mb-1">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Additional details about the vehicle..." className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none" />
      </div>

      <div>
        <label className="block text-sm font-body text-ink/70 mb-1">Video link (optional)</label>
        <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Paste a YouTube link" className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none" />
      </div>

      <label className="flex items-center gap-2 font-body text-sm text-ink/80">
        <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="w-5 h-5" />
        In stock / visible on the site
      </label>

      {error && <p className="text-sm text-madder font-body">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-stitch border border-thread font-body text-ink/70">Cancel</button>
        <button type="submit" disabled={saving} className="flex-1 py-3 rounded-stitch bg-madder text-wool font-body font-medium disabled:opacity-50">
          {saving ? 'Saving...' : existing ? 'Save changes' : 'Add vehicle'}
        </button>
      </div>
    </form>
  )
}