import Reveal from '../../components/public/Reveal'

const facilities = [
  {
    title: 'Smart Labs',
    image:
      'https://images.unsplash.com/photo-1581092787765-e3feb951d987?auto=format&fit=crop&w=900&q=80',
    description: 'Advanced science and robotics labs for practical experimentation and innovation.',
  },
  {
    title: 'Sports Complex',
    image:
      'https://images.unsplash.com/photo-1547347298-4074fc3086f0?auto=format&fit=crop&w=900&q=80',
    description: 'Indoor and outdoor arenas with expert coaching for athletics and team sports.',
  },
  {
    title: 'Library',
    image:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    description: 'A curated collection of books, journals, and digital learning resources.',
  },
  {
    title: 'Transport',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
    description: 'GPS-enabled buses with trained staff ensuring safe and reliable commute.',
  },
  {
    title: 'Auditorium',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
    description: 'State-of-the-art auditorium for assemblies, performances, and conferences.',
  },
  {
    title: 'Hostel',
    image:
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=900&q=80',
    description: 'Comfortable residential facilities with pastoral care and healthy dining.',
  },
]

const Facilities = () => {
  return (
    <div className="bg-[#F5F3EF]">
      <section className="bg-[#0B1E3F] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.24em] text-[#C6A75E]">Facilities</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold text-white sm:text-5xl">Designed for Learning, Wellness, and Growth</h1>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {facilities.map((facility, index) => (
            <Reveal key={facility.title} delay={index * 70}>
              <article className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <img src={facility.image} alt={facility.title} className="h-52 w-full object-cover transition duration-500 hover:scale-105" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#0B1E3F]">{facility.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#374151]">{facility.description}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Facilities
