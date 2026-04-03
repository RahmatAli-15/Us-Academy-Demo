import { useState } from 'react'
import Reveal from '../../components/public/Reveal'
import api from '../../api/axios'

const Contact = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await api.post('/public/contact', {
        name,
        email,
        message,
      })
      setSuccess('Thank you for your message. We will get back to you soon.')
      setName('')
      setEmail('')
      setMessage('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#F5F3EF]">
      

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0B1E3F]">Send Us a Message</h2>
              <p className="mt-2 text-sm text-gray-600">We'd love to hear from you! Please fill out the form below.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {success}
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-[#ddd6c6] bg-[#FDFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#C6A75E]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-[#ddd6c6] bg-[#FDFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#C6A75E]"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">Message</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your enquiry"
                    className="w-full rounded-xl border border-[#ddd6c6] bg-[#FDFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#C6A75E]"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="rounded-full bg-[#C6A75E] px-7 py-3 text-sm font-semibold text-[#0B1E3F] transition hover:-translate-y-0.5 hover:shadow-lg disabled:bg-gray-400"
                >
                  {loading ? 'Sending...' : 'Submit Enquiry'}
                </button>
                <p className="mt-3 text-xs text-gray-500">Limited to 3 submissions per hour per device to prevent spam.</p>
              </form>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-[#0B1E3F]">Contact Details</h3>
                <div className="mt-5 space-y-3 text-sm text-[#374151]">
                  <p><span className="font-semibold">Address:</span> Sihali Jageer, Katai Road, Sihali Jageer 244241</p>
                  <p><span className="font-semibold">Phone:</span> +91 9759000114 </p>
                  <p><span className="font-semibold">Email:</span> Usacademyofeducation@gmail.com</p>
                  <p><span className="font-semibold">Office Hours:</span> Monday - Saturday, 8:00 AM - 4:00 PM</p>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-3 shadow-sm">
  <div className="h-[300px] rounded-2xl overflow-hidden border-2 border-dashed border-[#d6ccb5]">
    
    <iframe
      src="https://www.google.com/maps?q=Sihali+Jageer+Katai+Road+Sihali+Jageer+244241&output=embed"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className="rounded-2xl"
    ></iframe>

  </div>
</div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Contact
