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

  const { data: comments, error: commentsError } = await supabase
    .from("project-comments")
    .select("*")
    .eq("project_id", params.id);

  console.log(comments);

  const createComment = async (formData: FormData) => {
    "use server";

    const supabase = createClient(cookies());

    const content = formData.get("content") as string;

    const { data, error } = await supabase
      .from("project-comments")
      .insert({ content, author_id: userId, project_id: params.id });

    if (error) {
      console.log(error);

      return redirect("/projects/" + params.id);
    }

    return redirect("/projects/" + params.id);
  }

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
        <div className="m-4">
          {userId && (
            <form
              action={createComment}
              className="max-w-md mx-auto bg-background rounded-lg shadow-md p-8"
            >
              <textarea
                placeholder="Content"
                name="content"
                className="w-full px-4 py-2 border border-gray-300 bg-inherit text-gray-700 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </form>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-4">Comments</h1>
          <div>
            {comments?.map((comment, index) => (
              <div
              key={index}
              className="bg-background rounded-md p-4 mb-4"
              style={{ marginBottom: "1rem" }}
            >
              <div>
                <Markdown
                  className={`${styles.postContent}`}
                  remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
                >
                  {comment.content}
                </Markdown>
              </div>
              <a
                href={`/profile/${comment.author_id}`}
                className="text-blue-500 hover:underline"
              >
                Author
              </a>
            </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
