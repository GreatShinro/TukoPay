import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function LinkGenerator() {
  const [name, setName] = useState('')
  const [publicKey, setPublicKey] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await fetch(`${API_BASE}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, publicKey, amount: amount || null, message }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Unable to create payment link')
      setResult(null)
      return
    }

    setResult(data)
  }

  return (
    <div>
      <h2 className="text-lg font-medium">Create a payment link</h2>
      <p className="mt-2 text-sm text-gray-600">Generate a unique URL you can share anywhere. Receipts settle instantly on Stellar testnet.</p>
      <form className="mt-4 space-y-4" onSubmit={handleCreate}>
        <div>
          <label className="block text-sm font-medium">Your display name</label>
          <input
            className="border border-slate-300 rounded-md p-3 w-full"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Your Stellar public key</label>
          <input
            className="border border-slate-300 rounded-md p-3 w-full"
            value={publicKey}
            onChange={e => setPublicKey(e.target.value)}
            placeholder="G..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount (leave blank for any amount)</label>
          <input
            className="border border-slate-300 rounded-md p-3 w-full"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="1.50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Message (optional)</label>
          <input
            className="border border-slate-300 rounded-md p-3 w-full"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
        <button className="px-5 py-3 bg-black text-white rounded-md" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Generate Link'}
        </button>
      </form>

      {error && <div className="mt-5 text-sm text-red-700">{error}</div>}

      {result && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm text-slate-600">Link created successfully</div>
          <a
            className="break-all text-blue-600 hover:underline"
            href={`${window.location.origin}/pay/${result.slug}`}
          >
            {`${window.location.origin}/pay/${result.slug}`}
          </a>
        </div>
      )}
    </div>
  )
}
