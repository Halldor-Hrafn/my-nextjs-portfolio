import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const forbiddenWords = process.env.FORBIDDEN_WORDS?.split(" ") || [];

export default async function Page({
  searchParams,
}: {
  searchParams: { error: string };
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const userId = (await supabase.auth.getUser()).data?.user?.id;

  const { data: posts, error: postError } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const createPost = async (formData: FormData) => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const userId = (await supabase.auth.getUser()).data?.user?.id;

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as File;

    const containsForbiddenWords = forbiddenWords.some((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return regex.test(title) || regex.test(content);
    });

    if (containsForbiddenWords) {
      return redirect("/post?error=forbidden-words");
    }

    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert([
        {
          title,
          content,
          author_id: userId,
        },
      ])
      .select();

    if (image.size > 0) {
      const imagePath = `post/${post![0].id}/${image.name}`;

      const { data, error } = await supabase.from("post-images").insert([
        {
          path: imagePath,
          post_id: post![0].id,
        },
      ]);

      const { data: imageUpload, error: imageUploadError } =
        await supabase.storage.from("post-images").upload(imagePath, image);
    }

    return redirect("/post");
  };

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="w-3/4 mx-auto">
        <div className="m-4">
          {userId && (
            <form
              action={createPost}
              className="max-w-md mx-auto bg-background rounded-lg shadow-md p-8"
            >
              <input
                type="text"
                placeholder="Title"
                name="title"
                className="w-full px-4 py-2 border bg-inherit text-gray-700 border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Content"
                name="content"
                className="w-full px-4 py-2 border bg-inherit text-gray-700 border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
              <input
                type="file"
                name="image"
                id="image"
                accept="image/jpg"
                className="w-full px-4 py-2 border bg-inherit text-gray-700 border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
              {searchParams.error === "forbidden-words" && (
                <div className="mt-4 p-4 bg-red-500 text-white text-center">
                  <p>
                  Your post contains forbidden words. Nice try :) And I swear to
                  god if you try to post 7 billion posts that are just the same
                  forbidden word over and over again I will take away your
                  rights to create new posts
                  </p>
                  <p>
                    Yea this is probably very easy to bypass since I am just using
                    an array of words with REGEX.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>
        {posts?.map((post, index) => (
          <div key={index} className="bg-background rounded-md p-4 mb-4">
            <h3 className="text-xl font-bold mb-2">
              <a href={`/post/${post.id}`}>{post.title}</a>
            </h3>
            <p className="text-gray-500">{post.content}</p>
            <a
              href={`/profile/${post.author_id}`}
              className="text-blue-500 hover:underline"
            >
              Author
            </a>
          </div>
        ))}
      </main>
    </div>
  );
}
