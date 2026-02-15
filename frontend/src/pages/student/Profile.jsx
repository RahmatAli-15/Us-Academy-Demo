import { useState, useEffect } from 'react'
import api from '../../api/axios'

const Profile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await api.get('/student/me')
      setProfile(response.data)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-8">Loading profile...</div>

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Profile not found</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Student Profile</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="bg-blue-600 h-32"></div>

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="-mt-16 mb-4">
                <div className="w-32 h-32 bg-gray-300 rounded-full border-4 border-white flex items-center justify-center">
                  <span className="text-4xl text-gray-600">👤</span>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-gray-900">{profile.name}</h2>
              <p className="text-gray-600 mt-1">Student ID: {profile.student_id}</p>
              <p className="text-gray-600">Class: {profile.class_number}</p>

              <div className="mt-8 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900">{profile.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="text-gray-900">{profile.dob}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Address</label>
                  <p className="text-gray-900">{profile.address}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Parent/Guardian Email</label>
                  <p className="text-gray-900">{profile.parent_email}</p>
                </div>
              </div>
            </div>

            <div className="md:w-80">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="text-lg font-semibold text-green-600">
                      <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
                      Active
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(profile.created_at).toLocaleDateString()}</p>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="text-lg font-semibold text-gray-900">{new Date(profile.updated_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile