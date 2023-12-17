import Navbar from "@/components/Navbar";
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function Index({
  searchParams,
}: {
  searchParams: { code: string };
}) {
  const code = searchParams.code;

  if (code) {
    const cookiesStore = cookies();
    const supabase = createClient(cookiesStore);
    await supabase.auth.exchangeCodeForSession(code);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center text-foreground">
          I code about one line at a time.
        </h1>
        <p className="text-xl text-center text-foreground">
          I am a wanabe developer who gets side-tracked from their projects 100%
          of the time.
        </p>
      </main>
    </div>
  );
}
