import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react'

const PublicFooter = () => {
  return (
    <footer className="bg-[#0B1E3F] text-[#F5F3EF]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C6A75E]">US Academy</p>
            <h3 className="mt-3 text-2xl font-semibold">Excellence Through Character</h3>
            <p className="mt-4 text-sm leading-7 text-[#d7d3cb]">
              A premier learning community nurturing scholarship, leadership, and global citizenship.
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 text-[#C6A75E]" />
              <p>24 Imperial Avenue, Greenwood Estate, New Delhi 110018</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-[#C6A75E]" />
              <p>+91 11 4256 9800</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-[#C6A75E]" />
              <p>admissions@usacademy.edu.in</p>
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[#C6A75E]">Connect</p>
            <div className="mt-4 flex gap-3">
              <a href="#" className="rounded-full border border-[#C6A75E]/40 p-2.5 text-[#C6A75E] transition hover:-translate-y-1 hover:bg-[#C6A75E] hover:text-[#0B1E3F]">
                <Facebook size={18} />
              </a>
              <a href="#" className="rounded-full border border-[#C6A75E]/40 p-2.5 text-[#C6A75E] transition hover:-translate-y-1 hover:bg-[#C6A75E] hover:text-[#0B1E3F]">
                <Instagram size={18} />
              </a>
              <a href="#" className="rounded-full border border-[#C6A75E]/40 p-2.5 text-[#C6A75E] transition hover:-translate-y-1 hover:bg-[#C6A75E] hover:text-[#0B1E3F]">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-6 text-xs text-[#c6c1b7]">
          <p>© 2026 US Academy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default PublicFooter
