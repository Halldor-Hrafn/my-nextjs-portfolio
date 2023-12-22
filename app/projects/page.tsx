import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const userId = (await supabase.auth.getUser()).data?.user?.id;

  const { data: projects, error: projectsError } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto m-10 bg-background rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">Projects</h1>
          <p className="text-gray-700 mb-4">
            Here you can find all of my projects, from my website to my
            discord bots.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects?.map((project) => (
              <div
                key={project.id}
                className="bg-background rounded-lg shadow-md p-8"
              >
                <h1 className="text-2xl font-bold mb-4">
                  <a href={`/projects/${project.id}`}>
                    {project.name}
                  </a>
                </h1>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
