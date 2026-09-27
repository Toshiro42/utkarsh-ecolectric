import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const CATEGORIES = ['Scooter', 'E-Rickshaw']
const MAX_IMAGES = 5

function removeUnit(value, unit) {
  return String(value || '').replace(new RegExp(`\\s*${unit}\\s*$`, 'i'), '').trim()
}

export default function ProductForm({ existing, onDone, onCancel }) {
  const [name, setName] = useState(existing?.name || '')
  const [price, setPrice] = useState(existing?.price || '')
  const [description, setDescription] = useState(existing?.description || '')
  const [category, setCategory] = useState(existing?.category || CATEGORIES[0])
  const [available, setAvailable] = useState(existing?.available ?? true)
  const [videoUrl, setVideoUrl] = useState(existing?.video_url || '')

  const [specifications, setSpecifications] = useState({
    top_speed: removeUnit(existing?.specifications?.top_speed, 'km/h'),
    range: removeUnit(existing?.specifications?.range, 'km'),
    battery_type: existing?.specifications?.battery_type || '',
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

      const payload = {
        name,
        price: Number(price),
        description,
        category,
        available,
        image_urls,
        video_url: videoUrl.trim() || null,
        specifications: {
          top_speed: specifications.top_speed.trim(),
          range: specifications.range.trim(),
          battery_type: specifications.battery_type.trim(),
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
      setError('Something went wrong saving this. Try again.')
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
              <button
                type="button"
                onClick={() => removeExistingImage(url)}
                className="absolute top-0.5 right-0.5 bg-madder text-white rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}

          {newFiles.map((file, i) => (
            <div key={i} className="relative w-20 h-20 rounded-stitch overflow-hidden border border-thread">
              <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute top-0.5 right-0.5 bg-madder text-white rounded-full w-5 h-5 text-xs leading-none flex items-center justify-center"
              >
                ×
              </button>
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
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Mantra Urban 100"
          className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-body text-ink/70 mb-1">Price (₹)</label>
        <input
          required
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="89999"
          className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-body text-ink/70 mb-1">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-5 border-t border-thread/70 pt-5">
        <h2 className="font-display text-xl text-ink">Technical specifications</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="font-body text-sm text-ink/70">
            Top speed
            <span className="relative mt-1 block">
              <input value={specifications.top_speed} onChange={(e) => updateSpecification('top_speed', e.target.value)} placeholder="65" className="w-full px-3 py-3 pr-16 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-body text-sm text-ink/45">km/h</span>
            </span>
          </label>
          <label className="font-body text-sm text-ink/70">
            Range
            <span className="relative mt-1 block">
              <input value={specifications.range} onChange={(e) => updateSpecification('range', e.target.value)} placeholder="80-100" className="w-full px-3 py-3 pr-16 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none" />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-body text-sm text-ink/45">km</span>
            </span>
          </label>
          <label className="font-body text-sm text-ink/70">
            Battery type
            <select value={specifications.battery_type} onChange={(e) => updateSpecification('battery_type', e.target.value)} className="mt-1 w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none">
              <option value="">Choose battery type</option>
              <option value="Lithium">Lithium</option>
              <option value="Lead Acid">Lead Acid</option>
            </select>
          </label>
          <label className="font-body text-sm text-ink/70 sm:col-span-2">
            Other specs
            <textarea value={specifications.other_specs} onChange={(e) => updateSpecification('other_specs', e.target.value)} rows={3} placeholder="Digital Meter, LED Headlight, Alloy Wheels, USB Charging Port" className="mt-1 w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none" />
            <span className="mt-1 block text-xs text-ink/50">Separate each item with a comma.</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-body text-ink/70 mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="Additional details about the vehicle..."
          className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-body text-ink/70 mb-1">Video link (optional)</label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Paste a YouTube link"
          className="w-full px-3 py-3 border border-thread rounded-stitch bg-white font-body text-base focus:border-madder outline-none"
        />
      </div>

      <label className="flex items-center gap-2 font-body text-sm text-ink/80">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
          className="w-5 h-5"
        />
        In stock / visible on the site
      </label>

      {error && <p className="text-sm text-madder font-body">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-3 rounded-stitch border border-thread font-body text-ink/70">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="flex-1 py-3 rounded-stitch bg-madder text-wool font-body font-medium disabled:opacity-50">
          {saving ? 'Saving...' : existing ? 'Save changes' : 'Add vehicle'}
        </button>
      </div>
    </form>
  )
}