import { Outlet } from 'react-router-dom'
import PublicFooter from '../components/public/PublicFooter'
import PublicNavbar from '../components/public/PublicNavbar'

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#1F2937]">
      <PublicNavbar />
      <main className="pt-20">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
