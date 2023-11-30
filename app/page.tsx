import Navbar from '@/components/Navbar'

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center text-sm">
          <Navbar />
        </div>
      </nav>
    </div>
  )
}
