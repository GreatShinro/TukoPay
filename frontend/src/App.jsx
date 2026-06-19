import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import LinkGenerator from './pages/LinkGenerator'
import PaymentPage from './pages/PaymentPage'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white text-black font-sans">
        <header className="p-6 border-b">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-semibold">TukoPay</h1>
            <nav className="space-x-4">
              <Link to="/">Create</Link>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/roadmap">Roadmap</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-3xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<LinkGenerator />} />
            <Route path="/pay/:slug" element={<PaymentPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
