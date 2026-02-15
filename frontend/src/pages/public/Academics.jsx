import Reveal from '../../components/public/Reveal'

const classBands = [
  { level: 'Classes 1-2', focus: 'Foundational literacy, numeracy, and joyful discovery-based learning.' },
  { level: 'Classes 3-5', focus: 'Concept mastery, language fluency, and creativity through projects.' },
  { level: 'Classes 6-8', focus: 'Analytical thinking, STEM immersion, and interdisciplinary exploration.' },
  { level: 'Classes 9-10', focus: 'Board exam readiness, advanced subject depth, and career orientation.' },
]

const subjects = [
  'English Language & Literature',
  'Hindi',
  'Mathematics',
  'Science',
  'Social Science',
  'Computer Science',
  'Art & Design',
  'Physical Education',
]

const Academics = () => {
  return (
    <div className="bg-[#F5F3EF]">
      <section className="bg-[#0B1E3F] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Academics</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">Rigorous Learning with Real-World Relevance</h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <Reveal>
          <h2 className="text-3xl font-semibold text-[#0B1E3F]">Class 1 to 10 Overview</h2>
          <p className="mt-4 max-w-3xl leading-8 text-[#374151]">
            Our academic framework is designed to progress from foundational competencies to higher-order reasoning, ensuring students are prepared for board
            success and lifelong learning.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {classBands.map((band, index) => (
            <Reveal key={band.level} delay={index * 80}>
              <article className="rounded-2xl bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <h3 className="text-xl font-semibold text-[#0B1E3F]">{band.level}</h3>
                <p className="mt-3 text-sm leading-7 text-[#374151]">{band.focus}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-semibold text-[#0B1E3F]">Curriculum Details</h2>
            <p className="mt-4 max-w-3xl leading-8 text-[#374151]">
              We follow a balanced curriculum that integrates academics, leadership, and wellbeing. Regular assessments, experiential labs, and portfolio
              projects help students apply concepts beyond textbooks.
            </p>
          </Reveal>
          <div className="mt-10 rounded-3xl border border-[#eee6d8] bg-[#F5F3EF] p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-[#9b8755]">Subjects Offered</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {subjects.map((subject, index) => (
                <Reveal key={subject} delay={index * 60}>
                  <div className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-[#1F2937] shadow-sm">{subject}</div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <div className="rounded-3xl bg-[#0B1E3F] px-8 py-12 text-center">
              <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Board Affiliation</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">Affiliated to CBSE, New Delhi</h2>
              <p className="mx-auto mt-4 max-w-2xl text-[#e2dfd8]">
                US Academy follows CBSE guidelines with enhanced enrichment modules for coding, communication, and entrepreneurship.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}

export default Academics
