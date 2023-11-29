import Navbar from '@/components/Navbar'
import AuthButton from '../components/AuthButton'
import { cookies } from 'next/headers'

export default async function Index() {
  const cookieStore = cookies()

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 text-sm">
          {/* <AuthButton /> */}
          <Navbar />
        </div>
      </nav>
    </div>
  )
}