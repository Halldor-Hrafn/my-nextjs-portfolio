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
        <div>
          <h1 className="text-2xl font-bold mb-4">Projects</h1>
          <ul>
            {projects?.map((project) => (
              <li key={project.id} className="mb-4">
                <div className="flex items-center">
                  <a
                    href={`/projects/${project.id}`}
                    className="text-blue-500 hover:underline mr-2"
                  >
                    {project.name}
                  </a>
                  <p className="text-gray-600">{project.short_description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
