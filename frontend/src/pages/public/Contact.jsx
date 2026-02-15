import Reveal from '../../components/public/Reveal'

const Contact = () => {
  return (
    <div className="bg-[#F5F3EF]">
      <section className="bg-[#0B1E3F] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Contact</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">Start Your Admission Conversation</h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-[#0B1E3F]">Send Us a Message</h2>
              <form className="mt-6 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">Name</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-[#ddd6c6] bg-[#FDFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#C6A75E]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full rounded-xl border border-[#ddd6c6] bg-[#FDFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#C6A75E]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#1F2937]">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your enquiry"
                    className="w-full rounded-xl border border-[#ddd6c6] bg-[#FDFCF9] px-4 py-3 text-sm outline-none transition focus:border-[#C6A75E]"
                  />
                </div>
                <button type="submit" className="rounded-full bg-[#C6A75E] px-7 py-3 text-sm font-semibold text-[#0B1E3F] transition hover:-translate-y-0.5 hover:shadow-lg">
                  Submit Enquiry
                </button>
              </form>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="space-y-6">
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-[#0B1E3F]">Contact Details</h3>
                <div className="mt-5 space-y-3 text-sm text-[#374151]">
                  <p><span className="font-semibold">Address:</span> 24 Imperial Avenue, Greenwood Estate, New Delhi 110018</p>
                  <p><span className="font-semibold">Phone:</span> +91 11 4256 9800</p>
                  <p><span className="font-semibold">Email:</span> admissions@usacademy.edu.in</p>
                  <p><span className="font-semibold">Office Hours:</span> Monday - Saturday, 8:00 AM - 4:00 PM</p>
                </div>
              </div>
              <div className="rounded-3xl bg-white p-3 shadow-sm">
                <div className="flex h-[300px] items-center justify-center rounded-2xl border-2 border-dashed border-[#d6ccb5] bg-[#F5F3EF] text-sm text-[#6b7280]">
                  Google Map Placeholder
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
