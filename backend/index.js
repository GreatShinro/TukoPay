const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const StellarSdk = require('@stellar/stellar-sdk');
const db = require('./db');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HORIZON_URL = process.env.HORIZON_URL || 'https://horizon-testnet.stellar.org';
const HORIZON = new StellarSdk.Horizon.Server(HORIZON_URL);

function slugify(name) {
  const base = (name || 'tukopay').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const rand = crypto.randomBytes(3).toString('hex');
  return `${base}-${rand}`;
}

// Create a new payment link
app.post('/api/links', async (req, res) => {
  const { name, amount, message, publicKey, slug } = req.body;
  if (!name || !publicKey) return res.status(400).json({ error: 'name and publicKey required' });
  const finalSlug = slug || slugify(name);
  const stmt = db.prepare('INSERT INTO links (slug, name, public_key, amount, message) VALUES (?, ?, ?, ?, ?)');
  stmt.run(finalSlug, name, publicKey, amount || null, message || null, function (err) {
    if (err) {
      return res.status(500).json({ error: 'could not create link', details: err.message });
    }
    return res.json({ slug: finalSlug, url: `/pay/${finalSlug}` });
  });
});

// Get link metadata
app.get('/api/links/:slug', async (req, res) => {
  const { slug } = req.params;
  db.get('SELECT * FROM links WHERE slug = ?', [slug], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'not found' });
    res.json(row);
  });
});

// Dashboard: pull payments to the creator address from Horizon
app.get('/api/dashboard/:publicKey', async (req, res) => {
  const { publicKey } = req.params;
  try {
    const url = `${HORIZON_URL}/accounts/${encodeURIComponent(publicKey)}/payments?order=desc&limit=200`;
    const resp = await fetch(url);
    const data = await resp.json();
    // Filter relevant payment records (type "payment" to this account)
    const payments = (data._embedded && data._embedded.records || [])
      .filter(r => r.type === 'payment' && r.to === publicKey)
      .map(r => ({ id: r.id, created_at: r.created_at, amount: r.amount, asset_type: r.asset_type, asset_code: r.asset_code, from: r.from, tx_hash: r.transaction_hash }));
    res.json({ payments });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`TukoPay backend listening on ${PORT}`));

// TODO(issue): Mainnet support is not implemented. To add mainnet, change the
// network passphrase, Horizon URL, and real USDC issuer address in config.

// TODO(issue): No rate limiting on link creation endpoint — add rate limiting before public launch.
