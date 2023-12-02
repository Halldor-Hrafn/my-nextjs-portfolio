import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers'

export default async function Page({ params }: { params: { id: string }}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

  const userId = params.id;

  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", userId);

  const { data: comments, error: commentError } = await supabase
    .from("comments")
    .select("*")
    .eq("author_id", userId);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("auth_id", userId);

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="w-full grid grid-cols-3 gap-8">
        <div className="col-span-1">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center">
            <img
              src="https://i.imgur.com/0DTlT5W.png"
              alt="Profile Image"
              className="w-32 h-32 rounded-full mb-4"
            />
            <h1 className="text-3xl font-bold">{profile![0].user_name}</h1>
            <p className="text-gray-500">{profile![0].about_me}</p>
          </div>
        </div>
        <div className="col-span-2">
          {/* Post History */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Post History</h2>
            {posts?.map((post, index) => (
              <div key={index} className="bg-white rounded-md p-4 mb-4">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-500">{post.content}</p>
              </div>
            ))}
          </div>
          {/* Comment History */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Comment History</h2>
            {comments?.map((comment, index) => (
              <div key={index} className="bg-white rounded-md p-4 mb-4">
                <h3 className="text-xl font-bold mb-2">{comment.title}</h3>
                <p className="text-gray-500">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
