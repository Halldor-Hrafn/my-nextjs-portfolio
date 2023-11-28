"use client";

import Post from "@/components/Post";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";

export default function Page() {
  const [posts, setPosts] = useState<any[] | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchPosts = async () => {
      "use client";

      const { data } = await supabase.from("posts").select("*");

      setPosts(data);
    };

    const timeout = setTimeout(() => {
      fetchPosts();
    }, 1000);
  }, []);

  const inputPost = async (e: any) => {
    e.preventDefault();
    const { title, content } = e.target.elements;

    const { data, error } = await supabase
      .from("posts")
      .insert([
        { title: title.value, content: content.value }
      ])

      if (error) {
        console.log(error);
      } else {
        console.log(data);
      }
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form onSubmit={inputPost}>
        <input type="text" name="title" />
        <input type="text" name="content" />
        <button type="submit">Submit</button>
      </form>
      <h1>Posts</h1>
      {posts?.map((post) => (
        <Post key={post.id} title={post.title} content={post.content} />
      ))}
    </div>
  );
}
