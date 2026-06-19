import React from 'react'

export default function Roadmap() {
  return (
    <div>
      <h2 className="text-lg font-medium">TukoPay Roadmap</h2>
      <p className="mt-2 text-sm text-slate-600">This page tracks missing features and MVP gaps that still need implementation.</p>
      <ul className="mt-6 space-y-3 list-disc list-inside text-sm text-slate-700">
        <li>TODO(issue): Create mobile-friendly payment modal for smaller screens.</li>
        <li>TODO(issue): Add QR code generation for payment links so users can scan instead of copy.</li>
        <li>TODO(issue): Implement wallet connect fallback for non-Freighter wallets.</li>
        <li>TODO(issue): Add creator profile picture support on generated link pages.</li>
        <li>TODO(issue): Add link expiration settings and automatic cleanup.</li>
        <li>TODO(issue): Add support for recurring and subscription-style payments.</li>
        <li>TODO(issue): Add payment memo field to the Stellar transaction builder.</li>
        <li>TODO(issue): Add an optional payer note field on the checkout page.</li>
        <li>TODO(issue): Add link performance analytics and click tracking.</li>
        <li>TODO(issue): Add webhook event delivery for payment receipts.</li>
        <li>TODO(issue): Add donation campaign landing page with tiered amounts.</li>
        <li>TODO(issue): Add multi-asset checkout support for XLM and USDC.
</li>
        <li>TODO(issue): Add fiat on-ramp guidance for new Stellar users.</li>
        <li>TODO(issue): Add browser wallet detection and install guidance banners.</li>
        <li>TODO(issue): Add support for multiple creator receiving addresses.</li>
        <li>TODO(issue): Add open graph metadata for social link previews.</li>
        <li>TODO(issue): Add email receipt notifications for creators and payers.</li>
        <li>TODO(issue): Add event-driven transaction indexing for search.</li>
        <li>TODO(issue): Add scheduled cleanup worker for stale payment links.</li>
        <li>TODO(issue): Add optional GraphQL API for dashboard access.</li>
        <li>TODO(issue): Add accept/decline payment request flow for invoices.</li>
        <li>TODO(issue): Add pay-by-username lookup for creator aliases.</li>
        <li>TODO(issue): Add automated refund support and refund tracking.</li>
        <li>TODO(issue): Add audit logs for link metadata changes and payment updates.</li>
        <li>TODO(issue): Add improved onboarding copy and tutorial flow for first-time buyers.</li>
      </ul>
    </div>
  )
}
