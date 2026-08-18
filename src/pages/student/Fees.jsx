import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiCreditCard, FiDownload } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/student/Shared'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

export default function Fees() {
  const { user } = useAuth()
  const [fees, setFees] = useState([])
  const [payments, setPayments] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [payOpen, setPayOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [paying, setPaying] = useState(false)

  const load = async () => {
    const [{ data: feeData }, { data: paymentData }, { data: summaryData }] = await Promise.all([
      supabase.from('fee_items').select('*').eq('student_id', user.id),
      supabase.from('payments').select('*').eq('student_id', user.id).order('paid_at', { ascending: false }),
      supabase.from('fee_summary').select('*').eq('student_id', user.id).maybeSingle()
    ])
    setFees(feeData || [])
    setPayments(paymentData || [])
    setSummary(summaryData)
    setLoading(false)
  }

  useEffect(() => {
    if (user?.id) load()
  }, [user?.id])

  const handlePay = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      toast.error('Enter a valid amount.')
      return
    }
    setPaying(true)
    try {
      // In production this triggers a Paystack/Flutterwave checkout via the server,
      // which verifies payment before writing the record. This inserts a pending
      // record for demonstration of the real data flow.
      const { error } = await supabase.from('payments').insert({
        student_id: user.id,
        amount: Number(amount),
        method: 'card',
        status: 'pending',
        description: 'Fee payment'
      })
      if (error) throw error
      toast.success('Payment initiated. You will be redirected to complete checkout.')
      setPayOpen(false)
      setAmount('')
      load()
    } catch (err) {
      toast.error(err.message || 'Could not start payment.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return <SkeletonBlock className="h-96" />

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:grid-cols-4 h-fit">
          <StatCard icon={FiCreditCard} label="Total Fee" value={summary ? `₦${Number(summary.total_fee).toLocaleString()}` : '—'} index={0} />
          <StatCard icon={FiCreditCard} label="Amount Paid" value={summary ? `₦${Number(summary.amount_paid).toLocaleString()}` : '—'} tone="green" index={1} />
          <StatCard icon={FiCreditCard} label="Outstanding" value={summary ? `₦${Number(summary.outstanding_balance).toLocaleString()}` : '—'} tone="red" index={2} />
          <StatCard icon={FiCreditCard} label="Next Due" value={summary?.next_due_date ? new Date(summary.next_due_date).toLocaleDateString() : '—'} tone="accent" index={3} />
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-primary-900 to-accent-700 p-6 text-white shadow-soft">
          <p className="text-sm text-white/70">Outstanding Balance</p>
          <p className="mt-1 font-display text-2xl font-bold">₦{summary ? Number(summary.outstanding_balance).toLocaleString() : '0'}</p>
          <Button variant="secondary" className="mt-4 w-full justify-center !bg-white !text-primary-900" onClick={() => setPayOpen(true)}>
            Pay Now
          </Button>
        </div>
      </div>

      <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
        <h3 className="mb-4 font-semibold text-app-primary">Fee Overview</h3>
        {fees.length === 0 ? (
          <EmptyState icon={FiCreditCard} title="No fee items found" description="Your fee breakdown will appear here once published by the bursary." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-app-secondary">
                  <th className="pb-3 pr-3">Fee Type</th><th className="pb-3 pr-3">Total</th><th className="pb-3 pr-3">Paid</th><th className="pb-3 pr-3">Balance</th><th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.id} className="border-t app-border">
                    <td className="py-3 pr-3 text-app-primary">{f.fee_type}</td>
                    <td className="py-3 pr-3 text-app-secondary">₦{Number(f.total_amount).toLocaleString()}</td>
                    <td className="py-3 pr-3 text-app-secondary">₦{Number(f.amount_paid).toLocaleString()}</td>
                    <td className="py-3 pr-3 text-app-secondary">₦{Number(f.balance).toLocaleString()}</td>
                    <td className="py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${f.balance === 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {f.balance === 0 ? 'Paid' : 'Partially Paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
        <h3 className="mb-4 font-semibold text-app-primary">Payment History</h3>
        {payments.length === 0 ? (
          <p className="text-sm text-app-secondary">No payments recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl app-surface-2 px-4 py-3 text-sm">
                <div>
                  <p className="font-medium text-app-primary">{p.description}</p>
                  <p className="text-xs text-app-secondary">{new Date(p.paid_at || p.created_at).toLocaleDateString()} • {p.method}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-app-primary">₦{Number(p.amount).toLocaleString()}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${p.status === 'successful' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title="Make a Payment">
        <form onSubmit={handlePay} className="space-y-4">
          <Input label="Amount (₦)" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <p className="text-xs text-app-secondary">
            You'll be redirected to a secure checkout to complete this payment via card, transfer, or USSD.
          </p>
          <Button type="submit" loading={paying} className="w-full justify-center">Proceed to Payment</Button>
        </form>
      </Modal>
    </div>
  )
}
