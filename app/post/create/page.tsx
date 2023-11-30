import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
    <div>
      <form action={createPost}>
        <input type="text" placeholder="Title" name="title" />
        <textarea placeholder="Content" name="content" />
        <button formAction={createPost}>Submit</button>
      </form>
      <p>{searchParams.message}</p>
    </div>
  )
}
