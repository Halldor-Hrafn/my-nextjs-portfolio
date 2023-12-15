import Navbar from "@/components/Navbar";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { useState } from "react";

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
    imageUrl = supabase.storage
      .from("post-images")
      .getPublicUrl(postImages![0].path).data.publicUrl;
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
  };

  const deletePost = async (formData: FormData) => {
    "use server"

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const postId = formData.get("postId") as string;

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    console.log(error);

    return redirect("/post");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <Navbar />
      <main className="w-full px-4 sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto">
        <div className="bg-background rounded-md p-4 mb-4">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <h2 className="text-2xl font-bold mb-2 sm:mb-0 sm:mr-4">
              {post![0].title}
            </h2>
            {userId === post![0].author_id && (
              <form action={deletePost} className="inline">
                <input type="hidden" name="postId" value={post![0].id} />
                <button type="submit" className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                  Delete post
                </button>
              </form>
            )}
          </div>
          <div>
            <Markdown
              className={`${styles.postContent}`}
              remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
            >
              {post![0].content}
            </Markdown>
          </div>
          <img src={imageUrl} alt="" className="w-full mt-4" />
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
        <div className="rounded-md p-4 mb-4 m-4">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
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
      </main>
    </div>
  );
}
