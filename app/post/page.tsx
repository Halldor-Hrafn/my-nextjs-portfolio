import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore);

  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("*");

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main>
        {posts?.map((post, index) => (
          <div key={index} className="bg-white rounded-md p-4 mb-4">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>
            <p className="text-gray-500">{post.content}</p>
            <a href={`/profile/${post.author_id}`} className="text-blue-500 hover:underline">Author</a>
          </div>
        ))}
      </main>
    </div>
  );
}
