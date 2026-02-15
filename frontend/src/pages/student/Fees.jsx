import { useState, useEffect } from 'react'
import api from '../../api/axios'

const Fees = () => {
  const [fees, setFees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFees()
  }, [])

  const loadFees = async () => {
    try {
      const response = await api.get('/student/fees')
      setFees(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load fees')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading fees...</div>

  const totalFees = fees.reduce((sum, f) => sum + (f.amount || 0), 0)
  const paidFees = fees.reduce((sum, f) => sum + (f.amount_paid || 0), 0)
  const pendingFees = fees.reduce((sum, f) => sum + (f.amount_pending || 0), 0)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Fee Details</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 font-medium text-sm">Total Fees</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">₹{totalFees}</p>
        </div>
        <div className={`bg-white p-6 rounded-lg shadow ${paidFees > 0 ? 'border-l-4 border-green-600' : 'border-l-4 border-gray-300'}`}>
          <h3 className="text-gray-500 font-medium text-sm">Paid</h3>
          <p className={`text-3xl font-bold mt-2 ${paidFees > 0 ? 'text-green-600' : 'text-gray-600'}`}>₹{paidFees}</p>
        </div>
        <div className={`bg-white p-6 rounded-lg shadow ${pendingFees > 0 ? 'border-l-4 border-red-600' : 'border-l-4 border-gray-300'}`}>
          <h3 className="text-gray-500 font-medium text-sm">Pending</h3>
          <p className={`text-3xl font-bold mt-2 ${pendingFees > 0 ? 'text-red-600' : 'text-gray-600'}`}>₹{pendingFees}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Month</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Paid</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Pending</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {fees.map(fee => (
                <tr key={fee.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{fee.month}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">₹{fee.amount}</td>
                  <td className="px-6 py-4 text-sm text-green-600 font-medium">₹{fee.amount_paid}</td>
                  <td className="px-6 py-4 text-sm text-red-600 font-medium">₹{fee.amount_pending}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      fee.amount_pending === 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {fee.amount_pending === 0 ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {fees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No fee records found</p>
        </div>
      )}
    </div>
  )
}

export default Fees
