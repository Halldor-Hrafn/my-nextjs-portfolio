import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("id", params.id);

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
          <p className="text-gray-500">{post![0].content}</p>
        </div>
        <div className="m-4">
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
        </div>
        <div className="bg-white rounded-md p-4 mb-4">
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {comments?.map((comment, index) => (
            <div key={index} className="bg-white rounded-md p-4 mb-4">
              <p className="text-gray-500">{comment.content}</p>
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