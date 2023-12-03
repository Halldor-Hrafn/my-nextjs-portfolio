import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function Page({ searchParams }: { searchParams: { message: string }}) {
  const createPost = async (formData: FormData) => {
    "use server"

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const userId = (await supabase.auth.getUser()).data?.user?.id;

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const { error } = await supabase.from("posts").insert([
      {
        title,
        content,
        author_id: userId,
      },
    ]);

    if (error) {
      console.log(error);
      return redirect("/post/create?message=Could not create post");
    }

    return redirect("/post");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
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
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
      <p>{searchParams.message}</p>
    </div>
  )
}