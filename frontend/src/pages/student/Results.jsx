import { useState, useEffect } from 'react'
import api from '../../api/axios'

const Results = () => {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterExamType, setFilterExamType] = useState('')

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const response = await api.get('/student/results')
      setResults(response.data)
    } catch (err) {
      setError('Failed to load results')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredResults = filterExamType
    ? results.filter(r => r.exam_type === filterExamType)
    : results

  const examTypes = [...new Set(results.map(r => r.exam_type))]

  if (loading) {
    return <div className="text-center py-8">Loading results...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Results</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filter by Exam Type</h2>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilterExamType('')}
              className={`px-4 py-2 rounded text-sm font-medium ${
                !filterExamType ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
              }`}
            >
              All
            </button>
            {examTypes.map(exam => (
              <button
                key={exam}
                onClick={() => setFilterExamType(exam)}
                className={`px-4 py-2 rounded text-sm font-medium ${
                  filterExamType === exam ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                }`}
              >
                {exam}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Marks</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Exam Type</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-600">
                    {results.length === 0 ? 'No results found' : 'No results for selected exam type'}
                  </td>
                </tr>
              ) : (
                filteredResults.map(result => (
                  <tr key={result.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">Subject {result.subject}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        result.marks >= 80 ? 'bg-green-100 text-green-800' :
                        result.marks >= 60 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {result.marks}/100
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{result.exam_type}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Results
