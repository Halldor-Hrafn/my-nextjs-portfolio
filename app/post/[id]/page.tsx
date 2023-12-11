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

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id);

    // would love to add support for embedding images within the text
    // would also like to add support for multiple images
    // aswell as markdown
    // but I'll add that later
  const { data: postImages, error: postImagesError } = await supabase
    .from("post-images")
    .select("*")
    .eq("post_id", params.id);

  let imageUrl = "";

  if (postImages!.length > 0) {
    imageUrl = supabase
      .storage
      .from("post-images")
      .getPublicUrl(postImages![0].path)
      .data.publicUrl;
  }

  const { data: comments, error: commentError } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", params.id);

  const createComment = async (formData: FormData) => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const userId = (await supabase.auth.getUser()).data?.user?.id;

    const content = formData.get("content") as string;

    const { error } = await supabase.from("comments").insert([
      {
        content,
        author_id: userId,
        post_id: params.id,
      },
    ]);

    return redirect(`/post/${params.id}`);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="w-2/4 mx-auto">
        <div className="bg-white rounded-md p-4 mb-4">
          <h2 className="text-2xl font-bold mb-4">{post![0].title}</h2>
          <div>
            <Markdown className={`${styles.postContent}`} remarkPlugins={[[remarkGfm, { singleTilde: false }]]} >
              {post![0].content}
            </Markdown>
          </div>
          <img src={imageUrl} alt="" />
        </div>
        <div className="m-4">
          {userId && (
            <form action={createComment} className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
              <textarea
                placeholder="Content"
                name="content"
                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="rounded-md p-4 mb-4 m-4">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {comments?.map((comment, index) => (
            <div key={index} className="bg-white rounded-md p-4 mb-4" style={{ marginBottom: '1rem' }}>
              <div>
                <Markdown className={`${styles.postContent}`} remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
                  {comment.content}
                </Markdown>
              </div>
              <a href={`/profile/${comment.author_id}`} className="text-blue-500 hover:underline">
                Author
              </a>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
