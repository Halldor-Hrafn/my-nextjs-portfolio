import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers'
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const createPost = async (formData: FormData) => {
    "use server"

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const userId = (await supabase.auth.getUser()).data?.user?.id;

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File;

    const { data: post, error: postError } = await supabase.from("posts").insert([
      {
        title,
        content,
        author_id: userId,
      },
    ])
    .select();

    const imagePath = `post/${post![0].id}`

    const { data, error } = await supabase
      .from("post-images")
      .insert([
        {
          path: imagePath,
          post_id: post![0].id,
        }
      ])

    const { data: imageUpload, error: imageUploadError } = await supabase
      .storage
      .from("post-images")
      .upload(imagePath, image)

    return redirect("/post");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="w-3/4 mx-auto">
        <div className="flex-1 w-full flex flex-col gap-20 items-center m-4">
          <form action={createPost} className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <input
              type="text"
              placeholder="Title"
              name="title"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Content"
              name="content"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <input 
              type="file" 
              name="image"
              id="image"
              accept="image/jpg"
              className="mb-4 appearance-none bg-white border border-gray-300 py-2 px-4 rounded-md text-sm leading-tight focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        </div>
        {posts?.map((post, index) => (
          <div key={index} className="bg-white rounded-md p-4 mb-4">
            <h3 className="text-xl font-bold mb-2">
              <a href={`/post/${post.id}`}>{post.title}</a>
            </h3>
            <p className="text-gray-500">{post.content}</p>
            <a href={`/profile/${post.author_id}`} className="text-blue-500 hover:underline">Author</a>
          </div>
        ))}
      </main>
    </div>
  );
}
