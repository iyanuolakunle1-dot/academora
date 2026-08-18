import React, { useEffect, useState } from 'react'
import { FiCreditCard } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/shared/Widgets'

export default function AdminFees() {
  const [payments, setPayments] = useState([])
  const [totals, setTotals] = useState({ collected: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.from('payments').select('*, profiles(full_name)').order('created_at', { ascending: false }).limit(50).then(({ data }) => {
      if (!mounted) return
      const rows = data || []
      setPayments(rows)
      setTotals({
        collected: rows.filter((p) => p.status === 'successful').reduce((s, p) => s + Number(p.amount), 0),
        pending: rows.filter((p) => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0)
      })
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  if (loading) return <SkeletonBlock className="h-96" />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard icon={FiCreditCard} label="Total Collected" value={`₦${totals.collected.toLocaleString()}`} tone="green" index={0} />
        <StatCard icon={FiCreditCard} label="Pending" value={`₦${totals.pending.toLocaleString()}`} tone="accent" index={1} />
        <StatCard icon={FiCreditCard} label="Transactions" value={payments.length} tone="primary" index={2} />
      </div>

      <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
        <h3 className="mb-4 font-semibold text-app-primary">Recent Transactions</h3>
        {payments.length === 0 ? (
          <EmptyState icon={FiCreditCard} title="No transactions yet" description="Payments made by students will appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs text-app-secondary"><th className="pb-3 pr-3">Student</th><th className="pb-3 pr-3">Description</th><th className="pb-3 pr-3">Amount</th><th className="pb-3">Status</th></tr></thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t app-border">
                    <td className="py-3 pr-3 text-app-primary">{p.profiles?.full_name || '—'}</td>
                    <td className="py-3 pr-3 text-app-secondary">{p.description}</td>
                    <td className="py-3 pr-3 text-app-secondary">₦{Number(p.amount).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${p.status === 'successful' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{p.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
