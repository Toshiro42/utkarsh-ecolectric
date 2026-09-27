import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AdminLogin({ onLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError('That email or password isn\'t right. Try again.')
    } else {
      onLoggedIn()
    }
  }

  return (
    <div className="min-h-screen bg-wool flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-[#F5F7F6] border border-thread rounded-stitch p-8 text-wool shadow-xl"
      >
        <h1 className="font-display text-2xl text-wool mb-1">Manage your shop</h1>
        <p className="text-sm text-wool/60 font-body mb-6">Log in to add or edit products.</p>

        <label className="block text-sm font-body text-wool/70 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-thread rounded-stitch bg-white font-body focus:border-madder outline-none"
        />

        <label className="block text-sm font-body text-wool/70 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-thread rounded-stitch bg-white font-body focus:border-madder outline-none"
        />

        {error && <p className="text-sm text-madder font-body mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-madder text-wool font-body font-medium py-2.5 rounded-stitch hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </div>
  )
}
