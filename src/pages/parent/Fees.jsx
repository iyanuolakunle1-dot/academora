import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { FiCreditCard } from 'react-icons/fi'
import { supabase } from '../../lib/supabaseClient'
import { useLinkedChildren, ChildPicker, NoChildrenLinked } from '../../components/shared/useLinkedChildren'
import { StatCard, EmptyState, SkeletonBlock } from '../../components/shared/Widgets'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import Input from '../../components/ui/Input'

export default function ParentFees() {
  const { children, activeChild, setActiveChild, loading } = useLinkedChildren()
  const [fees, setFees] = useState([])
  const [summary, setSummary] = useState(null)
  const [fetching, setFetching] = useState(true)
  const [payOpen, setPayOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [paying, setPaying] = useState(false)

  const load = async () => {
    const [{ data: f }, { data: s }] = await Promise.all([
      supabase.from('fee_items').select('*').eq('student_id', activeChild.id),
      supabase.from('fee_summary').select('*').eq('student_id', activeChild.id).maybeSingle()
    ])
    setFees(f || [])
    setSummary(s)
    setFetching(false)
  }

  useEffect(() => {
    if (activeChild?.id) load()
  }, [activeChild?.id])

  const handlePay = async (e) => {
    e.preventDefault()
    if (!amount || Number(amount) <= 0) {
      toast.error('Enter a valid amount.')
      return
    }
    setPaying(true)
    try {
      const { error } = await supabase.from('payments').insert({
        student_id: activeChild.id,
        amount: Number(amount),
        method: 'card',
        status: 'pending',
        description: `Fee payment for ${activeChild.full_name}`
      })
      if (error) throw error
      toast.success('Payment initiated.')
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
  if (children.length === 0) return <NoChildrenLinked />

  return (
    <div>
      <ChildPicker children={children} activeChild={activeChild} setActiveChild={setActiveChild} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
        <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:grid-cols-3 h-fit">
          <StatCard icon={FiCreditCard} label="Total Fee" value={summary ? `₦${Number(summary.total_fee).toLocaleString()}` : '—'} index={0} />
          <StatCard icon={FiCreditCard} label="Paid" value={summary ? `₦${Number(summary.amount_paid).toLocaleString()}` : '—'} tone="green" index={1} />
          <StatCard icon={FiCreditCard} label="Outstanding" value={summary ? `₦${Number(summary.outstanding_balance).toLocaleString()}` : '—'} tone="red" index={2} />
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-primary-900 to-accent-700 p-6 text-white shadow-soft">
          <p className="text-sm text-white/70">Outstanding Balance</p>
          <p className="mt-1 font-display text-2xl font-bold">₦{summary ? Number(summary.outstanding_balance).toLocaleString() : '0'}</p>
          <Button variant="secondary" className="mt-4 w-full justify-center !bg-white !text-primary-900" onClick={() => setPayOpen(true)}>Pay Now</Button>
        </div>
      </div>
      <div className="rounded-2xl app-surface border app-border p-5 shadow-card">
        {fetching ? <SkeletonBlock className="h-40" /> : fees.length === 0 ? (
          <EmptyState icon={FiCreditCard} title="No fee items found" description="Fee breakdown will appear here once published by the bursary." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="text-xs text-app-secondary"><th className="pb-3 pr-3">Fee Type</th><th className="pb-3 pr-3">Total</th><th className="pb-3 pr-3">Paid</th><th className="pb-3">Balance</th></tr></thead>
              <tbody>
                {fees.map((f) => (
                  <tr key={f.id} className="border-t app-border">
                    <td className="py-3 pr-3 text-app-primary">{f.fee_type}</td>
                    <td className="py-3 pr-3 text-app-secondary">₦{Number(f.total_amount).toLocaleString()}</td>
                    <td className="py-3 pr-3 text-app-secondary">₦{Number(f.amount_paid).toLocaleString()}</td>
                    <td className="py-3 text-app-secondary">₦{Number(f.balance).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={payOpen} onClose={() => setPayOpen(false)} title={`Pay for ${activeChild?.full_name}`}>
        <form onSubmit={handlePay} className="space-y-4">
          <Input label="Amount (₦)" type="number" min="1" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <Button type="submit" loading={paying} className="w-full justify-center">Proceed to Payment</Button>
        </form>
      </Modal>
    </div>
  )
}
