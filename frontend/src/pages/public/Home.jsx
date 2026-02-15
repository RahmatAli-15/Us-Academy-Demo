import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Bus, Building2, Laptop, Microscope, Trophy, Users, Library, Dumbbell, FileText } from 'lucide-react'
import api from '../../api/axios'
import Reveal from '../../components/public/Reveal'

const excellenceCards = [
  { title: 'Modern Classrooms', icon: Building2, text: 'Technology-enabled classrooms crafted for collaborative, inquiry-based learning.' },
  { title: 'Experienced Faculty', icon: Users, text: 'Mentors from top institutions guiding each learner with personal attention.' },
  { title: 'Digital Learning', icon: Laptop, text: 'Blended pedagogy combining AI tools, digital labs, and live project studios.' },
  { title: 'Global Exposure', icon: BookOpen, text: 'Exchange programmes and international olympiads to build global perspective.' },
]

const stats = [
  { label: 'Students', value: '1500+' },
  { label: 'Faculty', value: '120+' },
  { label: 'Years of Excellence', value: '25+' },
  { label: 'Board Results', value: '100%' },
]

const facilities = [
  { title: 'Smart Labs', icon: Microscope },
  { title: 'Sports Complex', icon: Dumbbell },
  { title: 'Library', icon: Library },
  { title: 'Transport', icon: Bus },
  { title: 'Auditorium', icon: Trophy },
  { title: 'Hostel', icon: Building2 },
]

const testimonials = [
  {
    name: 'Radhika Mehra',
    role: 'Parent of Grade 8 Student',
    quote: 'US Academy has given my daughter confidence, discipline, and curiosity. The faculty quality is exceptional.',
  },
  {
    name: 'Arjun Sethi',
    role: 'Parent of Grade 5 Student',
    quote: 'The learning environment is world-class, and communication with parents is transparent and proactive.',
  },
  {
    name: 'Sana Khanna',
    role: 'Parent of Grade 10 Student',
    quote: 'From academics to sports, every programme is thoughtfully structured. This is truly premium schooling.',
  },
]

const Home = () => {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await api.get('/public/pdfs')
        const latest = [...response.data]
          .sort((a, b) => new Date(b.upload_date) - new Date(a.upload_date))
          .slice(0, 3)
        setNotices(latest)
      } catch (error) {
        console.error('Failed to load notices:', error)
      }
    }

    fetchNotices()
  }, [])

  return (
    <div className="overflow-hidden">
      <section
        className="relative min-h-[88vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(110deg, rgba(11,30,63,0.86), rgba(11,30,63,0.65)), url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1800&q=80')",
        }}
      >
        <div className="mx-auto flex min-h-[88vh] max-w-7xl items-center px-6 pb-14 pt-24 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-[#C6A75E]">Admissions 2026-27</p>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-7xl">
              Shaping Future Leaders with Excellence
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-[#F5F3EF] sm:text-xl">Where Education Meets Innovation</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/contact" className="rounded-full bg-[#C6A75E] px-7 py-3 text-sm font-semibold text-[#0B1E3F] transition hover:-translate-y-0.5 hover:shadow-xl">
                Apply Now
              </Link>
              <Link to="/academics" className="rounded-full border border-white/60 px-7 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-[#0B1E3F]">
                Explore Programs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center lg:px-8">
        <Reveal>
          <img
            src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"
            alt="School vision"
            className="h-[420px] w-full rounded-3xl object-cover shadow-2xl"
          />
        </Reveal>
        <Reveal delay={120}>
          <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">About US Academy</p>
          <h2 className="mt-4 text-3xl font-semibold text-[#0B1E3F] sm:text-4xl">A Tradition of Values, A Vision for Tomorrow</h2>
          <p className="mt-6 leading-8 text-[#374151]">
            US Academy blends academic rigor with character education. Our mission is to cultivate compassionate thinkers,
            problem-solvers, and future-ready leaders through global pedagogy, personalised mentoring, and a vibrant co-curricular culture.
          </p>
          <Link to="/about" className="mt-7 inline-block rounded-full border border-[#0B1E3F] px-6 py-2.5 text-sm font-semibold text-[#0B1E3F] transition hover:bg-[#0B1E3F] hover:text-white">
            Learn More
          </Link>
        </Reveal>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Academic Excellence</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#0B1E3F] sm:text-4xl">Built for Future-Focused Learning</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {excellenceCards.map((card, index) => {
              const Icon = card.icon
              return (
                <Reveal key={card.title} delay={index * 90}>
                  <article className="h-full rounded-2xl border border-[#e8e1d2] bg-[#F5F3EF] p-6 shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                    <Icon size={26} className="text-[#C6A75E]" />
                    <h3 className="mt-5 text-xl font-semibold text-[#0B1E3F]">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#374151]">{card.text}</p>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0B1E3F] py-16">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 text-center sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 80}>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <p className="text-4xl font-semibold text-[#C6A75E]">{stat.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.16em] text-[#F5F3EF]">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Campus Facilities</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#0B1E3F] sm:text-4xl">A Premium Environment for Holistic Growth</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility, index) => {
              const Icon = facility.icon
              return (
                <Reveal key={facility.title} delay={index * 80}>
                  <div className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                    <Icon size={24} className="text-[#C6A75E]" />
                    <h3 className="mt-4 text-xl font-semibold text-[#0B1E3F]">{facility.title}</h3>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Testimonials</p>
            <h2 className="mt-4 text-3xl font-semibold text-[#0B1E3F] sm:text-4xl">What Parents Say</h2>
          </Reveal>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <Reveal key={item.name} delay={index * 90}>
                <article className="h-full rounded-2xl border border-[#ece5d7] bg-[#F5F3EF] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <p className="text-sm leading-7 text-[#374151]">"{item.quote}"</p>
                  <p className="mt-5 text-base font-semibold text-[#0B1E3F]">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-[#9a844f]">{item.role}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Latest Notices</p>
                <h2 className="mt-3 text-3xl font-semibold text-[#0B1E3F]">Important Updates</h2>
              </div>
              <Link to="/notices" className="rounded-full border border-[#0B1E3F] px-5 py-2 text-sm font-semibold text-[#0B1E3F] transition hover:bg-[#0B1E3F] hover:text-white">
                View All Notices
              </Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {notices.length === 0 && (
              <div className="rounded-2xl bg-white p-6 text-sm text-[#374151] shadow-sm md:col-span-3">
                Notices will appear here once documents are published.
              </div>
            )}
            {notices.map((notice, index) => (
              <Reveal key={notice.id} delay={index * 80}>
                <article className="h-full rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <span className="inline-flex rounded-full bg-[#0B1E3F]/8 px-3 py-1 text-xs font-semibold tracking-[0.1em] text-[#0B1E3F]">
                    {notice.category}
                  </span>
                  <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-[#0B1E3F]">{notice.title}</h3>
                  <p className="mt-3 text-sm text-[#6b7280]">{new Date(notice.upload_date).toLocaleDateString()}</p>
                  <a
                    href={`${api.defaults.baseURL}/${notice.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#C6A75E] transition hover:gap-3"
                  >
                    <FileText size={16} />
                    View
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <Reveal className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-3xl bg-[#0B1E3F] px-8 py-14 text-center shadow-2xl">
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Admissions</p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">Admissions Open for 2026-27</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#e8e6df]">
              Begin your child’s journey with an institution committed to academic distinction and holistic growth.
            </p>
            <Link to="/contact" className="mt-8 inline-block rounded-full bg-[#C6A75E] px-8 py-3 text-sm font-semibold text-[#0B1E3F] transition hover:-translate-y-0.5 hover:shadow-xl">
              Enquire Now
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

export default Home
