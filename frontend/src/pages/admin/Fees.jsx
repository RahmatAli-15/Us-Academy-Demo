import { useEffect, useMemo, useState } from 'react'
import { CreditCard, Edit2, IndianRupee, Plus, Search, Sparkles, Trash2, User, Wallet, X } from 'lucide-react'
import api from '../../api/axios'
import { extractErrorMessage } from '../../utils/error'

const SummaryCard = ({ icon: Icon, label, value, tone = 'blue' }) => {
  const tones = {
    blue: 'from-blue-600/15 to-cyan-500/10 text-blue-700 ring-blue-200',
    emerald: 'from-emerald-500/15 to-teal-500/10 text-emerald-700 ring-emerald-200',
    amber: 'from-amber-500/15 to-orange-500/10 text-amber-700 ring-amber-200',
    rose: 'from-rose-500/15 to-red-500/10 text-rose-700 ring-rose-200',
  }

  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tones[tone]} p-4 ring-1`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
        <Icon size={20} />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-black text-stone-900">{value}</p>
    </div>
  )
}

const Fees = () => {
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [students, setStudents] = useState([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    paid_amount: '',
    remark: '',
  })

  useEffect(() => {
    // Fees would need a list endpoint on backend.
    // Current workflow remains student-search driven.
  }, [])

  useEffect(() => {
    if (showModal) {
      fetchStudentsForDropdown()
    }
  }, [showModal])

  const totalAmount = useMemo(
    () => fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0),
    [fees]
  )
  const totalPaid = useMemo(
    () => fees.reduce((sum, fee) => sum + Number(fee.paid_amount || 0), 0),
    [fees]
  )
  const totalDue = useMemo(
    () => fees.reduce((sum, fee) => sum + Number(fee.due_amount || 0), 0),
    [fees]
  )

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

  const fetchStudentsForDropdown = async () => {
    setStudentsLoading(true)
    try {
      const response = await api.get('/admin/students')
      setStudents(response.data || [])
    } catch (err) {
      setError(extractErrorMessage(err))
      setStudents([])
    } finally {
      setStudentsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchTerm) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError('')
    try {
      const studentsResponse = await api.get('/admin/students')
      const allStudents = studentsResponse.data || []

      const matchedStudent = allStudents.find(
        (student) =>
          String(student.student_id).toLowerCase() === searchTerm.trim().toLowerCase()
      )

      if (!matchedStudent) {
        setFees([])
        setError('Student not found')
        return
      }

      const feesResponse = await api.get(`/admin/fees/student/${matchedStudent.id}`)
      setFees(feesResponse.data || [])
    } catch (err) {
      setError(extractErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = {
        student_id: parseInt(formData.student_id, 10),
        amount: parseFloat(formData.amount),
        paid_amount: parseFloat(formData.paid_amount),
        remark: formData.remark,
      }

      if (editingId) {
        await api.put(`/admin/fees/${editingId}`, payload)
        setSuccess('Fee updated successfully')
      } else {
        await api.post('/admin/fees', payload)
        setSuccess('Fee record created successfully')
      }

      setShowModal(false)
      setFormData({ student_id: '', amount: '', paid_amount: '', remark: '' })
      setEditingId(null)
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const handleEdit = (fee) => {
    setFormData({
      student_id: String(fee.student_id),
      amount: fee.amount,
      paid_amount: fee.paid_amount,
      remark: fee.remark,
    })
    setEditingId(fee.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee record?')) return

    try {
      await api.delete(`/admin/fees/${id}`)
      setSuccess('Fee record deleted successfully')
      setFees(fees.filter((fee) => fee.id !== id))
    } catch (err) {
      setError(extractErrorMessage(err))
    }
  }

  const handleAddNew = () => {
    setFormData({ student_id: '', amount: '', paid_amount: '', remark: '' })
    setEditingId(null)
    setShowModal(true)
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_24px_60px_-24px_rgba(15,23,42,0.7)] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.35),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.18),_transparent_28%)]" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100 backdrop-blur">
              <Sparkles size={14} />
              Finance desk
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Fees management
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-200 sm:text-base">
              Search a student ledger, track dues clearly, and add or update fee records from one focused screen.
            </p>
          </div>

          <button
            onClick={handleAddNew}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:bg-blue-50"
          >
            <Plus size={18} />
            Add Fee
          </button>
        </div>
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700 shadow-sm">
          {success}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={CreditCard} label="Records Found" value={fees.length} tone="blue" />
        <SummaryCard icon={IndianRupee} label="Total Fee" value={`Rs ${formatCurrency(totalAmount)}`} tone="amber" />
        <SummaryCard icon={Wallet} label="Paid" value={`Rs ${formatCurrency(totalPaid)}`} tone="emerald" />
        <SummaryCard icon={User} label="Due" value={`Rs ${formatCurrency(totalDue)}`} tone="rose" />
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white/90 p-6 shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)] backdrop-blur">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Search Ledger</p>
          <h2 className="text-xl font-bold text-slate-900">Find records by student ID</h2>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search by student ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:bg-gray-400"
          >
            <Search size={18} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_18px_50px_-28px_rgba(15,23,42,0.24)]">
        <div className="border-b border-slate-200 bg-slate-50/80 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Ledger Table</p>
          <h3 className="text-lg font-bold text-slate-900">Fee records</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-slate-100/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Student</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Total Fee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Paid</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Due</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No fees found
                  </td>
                </tr>
              ) : (
                fees.map((fee, index) => (
                  <tr key={fee.id} className={`border-t border-slate-100 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">Student #{fee.student_id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">Rs {formatCurrency(fee.amount)}</td>
                    <td className="px-6 py-4 text-sm text-emerald-700">Rs {formatCurrency(fee.paid_amount)}</td>
                    <td className="px-6 py-4 text-sm text-rose-700">Rs {formatCurrency(fee.due_amount)}</td>
                    <td className="space-x-2 px-6 py-4 text-sm">
                      <button
                        onClick={() => handleEdit(fee)}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-2 font-medium text-blue-700 transition hover:bg-blue-100"
                      >
                        <Edit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(fee.id)}
                        className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-2 font-medium text-red-700 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[32px] border border-white/20 bg-white shadow-[0_30px_80px_-28px_rgba(15,23,42,0.55)]">
            <div className="border-b border-slate-200 bg-[linear-gradient(135deg,#f8fbff_0%,#ffffff_55%,#eef4ff_100%)] px-5 py-5 sm:px-8 sm:py-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Fee Form</p>
                  <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">{editingId ? 'Edit Fee' : 'Add Fee'}</h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                    Capture payment details cleanly and keep the student ledger up to date.
                  </p>
                </div>
                <button onClick={() => setShowModal(false)} className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
                  <X size={22} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Mode</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{editingId ? 'Updating record' : 'Creating record'}</p>
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-slate-200">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{studentsLoading ? 'Loading students' : 'Ready'}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-5 py-5 sm:px-8 sm:py-7">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Student ID</label>
                <select
                  name="student_id"
                  value={formData.student_id}
                  onChange={handleInputChange}
                  disabled={editingId || studentsLoading}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                >
                  <option value="">
                    {studentsLoading ? 'Loading students...' : 'Select Student'}
                  </option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.student_id} - {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Total Amount</label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Paid Amount</label>
                <input
                  type="number"
                  step="0.01"
                  name="paid_amount"
                  value={formData.paid_amount}
                  onChange={handleInputChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">Remark</label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleInputChange}
                  className="h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  placeholder="Add a short note about this payment"
                />
              </div>
              <div className="flex flex-col gap-4 pt-2 sm:flex-row">
                <button type="submit" className="flex-1 rounded-2xl bg-slate-950 px-4 py-3.5 font-semibold text-white shadow-[0_14px_30px_-18px_rgba(15,23,42,0.8)] transition hover:-translate-y-0.5 hover:bg-slate-800">
                  {editingId ? 'Update' : 'Add'} Fee
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-2xl bg-stone-100 px-4 py-3.5 font-semibold text-stone-900 transition hover:bg-stone-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Fees
