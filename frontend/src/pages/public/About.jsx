import Reveal from '../../components/public/Reveal'

const leaders = [
  {
    name: 'Dr. Kavita Anand',
    role: 'Chairperson',
    bio: 'An education reform advocate with 20+ years of strategic leadership in progressive schooling.',
  },
  {
    name: 'Mr. Daniel Joseph',
    role: 'Executive Director',
    bio: 'Leads innovation, faculty development, and future-focused institutional planning.',
  },
  {
    name: 'Ms. Ayesha Nair',
    role: 'Principal',
    bio: 'Known for creating high-performing academic systems and student-centric culture.',
  },
]

const About = () => {
  return (
    <div className="bg-[#F5F3EF]">
      <section className="bg-[#0B1E3F] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">About Us</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">A Legacy of Education, Character, and Leadership</h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8">
        <Reveal>
          <img
            src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1200&q=80"
            alt="School history"
            className="h-[420px] w-full rounded-3xl object-cover shadow-2xl"
          />
        </Reveal>
        <Reveal delay={120}>
          <h2 className="text-3xl font-semibold text-[#0B1E3F]">Our History</h2>
          <p className="mt-6 leading-8 text-[#374151]">
            Established in 2001, US Academy began with a single vision: to create an institution where academic distinction,
            ethics, and global outlook coexist. Over the years, we have evolved into a trusted educational community known for top board outcomes,
            innovation-led pedagogy, and strong student wellbeing frameworks.
          </p>
          <p className="mt-4 leading-8 text-[#374151]">
            Today, US Academy serves families from diverse backgrounds while preserving a culture of excellence and care.
          </p>
        </Reveal>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl border border-[#efe9dc] bg-[#F5F3EF] p-10 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Chairman’s Message</p>
              <p className="mt-5 text-xl leading-9 text-[#1F2937]">
                “At US Academy, education is not limited to the classroom. We nurture intellect, integrity, and empathy so every student can lead
                responsibly in a rapidly evolving world.”
              </p>
              <p className="mt-6 text-sm font-semibold text-[#0B1E3F]">Dr. Kavita Anand, Chairperson</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <Reveal>
              <article className="rounded-2xl bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-[#0B1E3F]">Vision</h3>
                <p className="mt-4 leading-8 text-[#374151]">
                  To be a globally respected school that inspires students to excel academically, think critically, and contribute meaningfully to society.
                </p>
              </article>
            </Reveal>
            <Reveal delay={120}>
              <article className="rounded-2xl bg-white p-8 shadow-sm">
                <h3 className="text-2xl font-semibold text-[#0B1E3F]">Mission</h3>
                <p className="mt-4 leading-8 text-[#374151]">
                  To deliver a balanced education through strong academics, values-based mentoring, modern infrastructure, and holistic development opportunities.
                </p>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Leadership Team</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#0B1E3F]">Steering Excellence with Purpose</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {leaders.map((leader, index) => (
              <Reveal key={leader.name} delay={index * 80}>
                <article className="h-full rounded-2xl border border-[#eee7d9] bg-[#F5F3EF] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <h3 className="text-xl font-semibold text-[#0B1E3F]">{leader.name}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[#9b8755]">{leader.role}</p>
                  <p className="mt-4 text-sm leading-7 text-[#374151]">{leader.bio}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About
