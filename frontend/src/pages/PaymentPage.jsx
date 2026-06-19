import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Asset, TransactionBuilder, Networks, Operation, Horizon } from '@stellar/stellar-sdk'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000'
const HORIZON_URL = import.meta.env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org'
const USDC_ISSUER = import.meta.env.VITE_USDC_ISSUER || '' // TODO(issue): Set the testnet USDC issuer address here

export default function PaymentPage() {
  const { slug } = useParams()
  const [meta, setMeta] = useState(null)
  const [amount, setAmount] = useState('')
  const [walletKey, setWalletKey] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [successHash, setSuccessHash] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/api/links/${slug}`)
      .then(r => r.json())
      .then(d => {
        setMeta(d)
        if (d.amount) setAmount(d.amount)
      })
      .catch(() => setError('Unable to load payment link metadata.'))
  }, [slug])

  async function connectWallet() {
    setError('')

    if (!window.freighterApi) {
      setError('Freighter wallet not detected. Install the Freighter extension.')
      return
    }

    try {
      const key = await window.freighterApi.getPublicKey()
      setWalletKey(key)
    } catch (e) {
      setError(e.message || 'Failed to connect wallet.')
    }
  }

  async function handlePay() {
    setError('')
    setSuccessHash('')

    if (!window.freighterApi) {
      setError('Freighter wallet not detected. Install the Freighter extension.')
      return
    }

    if (!USDC_ISSUER) {
      setError('USDC issuer is not configured. Contact the creator.')
      return
    }

    const payAmount = (amount || meta?.amount || '').trim()
    if (!payAmount) {
      setError('Enter an amount to pay.')
      return
    }

    try {
      setStatus('building')
      const server = new Horizon(HORIZON_URL)
      const payerKey = await window.freighterApi.getPublicKey()
      const account = await server.loadAccount(payerKey)
      const usdcAsset = new Asset('USDC', USDC_ISSUER)

      const hasTrustline = account.balances.some(
        b => b.asset_code === 'USDC' && b.asset_issuer === USDC_ISSUER
      )

      if (!hasTrustline) {
        setError('You do not have a trustline for USDC. Add trustline in Freighter before paying.')
        setStatus('idle')
        return
      }

      const tx = new TransactionBuilder(account, {
        fee: 100,
        networkPassphrase: Networks.TESTNET,
      })
        .addOperation(Operation.payment({
          destination: meta.public_key,
          asset: usdcAsset,
          amount: payAmount,
        }))
        .setTimeout(30)
        .build()

      const signed = await window.freighterApi.signTransaction(tx.toXDR(), Networks.TESTNET)
      const signedXDR = typeof signed === 'string' ? signed : signed?.signedTransaction || signed?.xdr || ''
      if (!signedXDR) {
        throw new Error('Unexpected Freighter response during signing.')
      }

      setStatus('submitting')
      const response = await server.submitTransaction(signedXDR)
      setSuccessHash(response.hash)
      setStatus('success')
    } catch (e) {
      // TODO(issue): Improve error handling and retry UX for failed transactions
      setError(e.message || 'Payment failed.')
      setStatus('error')
    }
  }

  if (!meta) return <div>Loading…</div>

  return (
    <div>
      <h2 className="text-lg font-medium">Pay {meta.name}</h2>
      {meta.message && <p className="mt-2 text-slate-600">{meta.message}</p>}
      <div className="mt-5 space-y-5">
        <div>
          <label className="block text-sm font-medium">Amount (USDC)</label>
          <input
            className="border border-slate-300 rounded-md p-3 w-full"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Amount"
          />
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">Receiver</p>
          <div className="mt-2 font-medium">{meta.name}</div>
          <div className="mt-1 text-xs text-slate-500 break-all">{meta.public_key}</div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            className="px-5 py-3 border rounded-md"
            type="button"
            onClick={connectWallet}
          >
            {walletKey ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
          <button
            className="px-5 py-3 bg-black text-white rounded-md"
            type="button"
            onClick={handlePay}
            disabled={status === 'building' || status === 'submitting'}
          >
            {status === 'building' || status === 'submitting' ? 'Processing…' : 'Pay Now'}
          </button>
        </div>
      </div>
      {error && (
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}
      {status === 'success' && successHash && (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          Payment submitted successfully. Transaction hash: <span className="font-mono">{successHash}</span>
        </div>
      )}
      <div className="mt-6 text-sm text-slate-500">
        <p>TODO(issue): No mobile wallet support yet — only Freighter browser extension is wired up.</p>
        <p>TODO(issue): No fee or USD conversion display yet.</p>
      </div>
    </div>
  )
}
