import Navbar from "@/components/Navbar";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import styles from "./page.module.css";

export default async function Page({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const userId = (await supabase.auth.getUser()).data?.user?.id;

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto m-10 bg-background rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">{project?.[0].name}</h1>
          <p>
            Project Link:{" "}
            <a
              href={project?.[0].project_link}
              className="text-blue-500 hover:underline"
            >
              Here
            </a>
          </p>
          <Markdown
            className={styles.projectContent}
            remarkPlugins={[remarkGfm]}
          >
            {project?.[0].description}
          </Markdown>
        </div>
      </main>
    </div>
  );
}
