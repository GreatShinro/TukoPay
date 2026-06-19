import React, { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'

export default function Dashboard() {
  const [publicKey, setPublicKey] = useState('')
  const [payments, setPayments] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function load() {
    setError('')
    setPayments(null)

    if (!publicKey.trim()) {
      setError('Enter a Stellar public key to load payments.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/${encodeURIComponent(publicKey.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Unable to load payments.')
        setPayments([])
      } else {
        setPayments(data.payments || [])
      }
    } catch (e) {
      setError(e.message || 'Failed to fetch dashboard data.')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-medium">Creator Dashboard</h2>
      <p className="mt-2 text-sm text-slate-600">Enter your receiving Stellar public key to view recent USDC payments.</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <input
          className="border border-slate-300 rounded-md p-3 flex-1"
          value={publicKey}
          onChange={e => setPublicKey(e.target.value)}
          placeholder="G..."
        />
        <button
          className="px-5 py-3 bg-black text-white rounded-md"
          onClick={load}
          disabled={loading}
        >
          {loading ? 'Loading…' : 'Load'}
        </button>
      </div>

      {error && <div className="mt-4 text-sm text-red-700">{error}</div>}

      {payments && payments.length === 0 && !loading && (
        <p className="mt-4 text-sm text-slate-600">No USDC payments found for this account yet.</p>
      )}

      {payments && payments.length > 0 && (
        <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-left text-sm uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {payments.map(p => (
                <tr key={p.id}>
                  <td className="px-4 py-3 text-sm text-slate-700">{p.created_at}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{p.amount} {p.asset_code || p.asset_type}</td>
                  <td className="px-4 py-3 text-sm text-slate-700 break-all">{p.from}</td>
                  <td className="px-4 py-3 text-sm">
                    <a
                      className="text-blue-600 hover:underline"
                      href={`https://horizon-testnet.stellar.org/transactions/${p.tx_hash}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      view
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <p>Note: this dashboard is for quick MVP use and does not require authentication yet.</p>
        <p className="mt-2">TODO(issue): add simple auth and pagination before production.</p>
      </div>
    </div>
  )
}
