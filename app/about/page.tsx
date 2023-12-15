import React from 'react';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';

import { Resend } from 'resend';

export default async function Page() {
  const sendRequest = async (formData: FormData) => {
    "use server"

    const resend = new Resend(process.env.RESEND_API_KEY!);

    const name = formData.get("name") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;

    const email = process.env.EMAIL!;

    let typeString = "";

    if (type === "feature") {
      typeString = "Feature Request"
    } else {
      typeString = "Bug Report"
    }

    try {
      await resend.emails.send({
        from: 'Mr. Potts <portfolio@pottss.dev>',
        to: [email],
        subject: typeString,
        text: `Name: ${name}\nType: ${type}\nDescription: ${description}`,
      })
    } catch (error) {
      console.log(error)
    }

    return redirect("/about");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto m-10 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">About Me</h1>
          <p className="text-gray-700 mb-4">
            You want to know more about me? Well, you have stumbled upon the right place my friend.
          </p>
        </div>
        <div className="max-w-3xl mx-auto m-10 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">Who am I?</h1>
          <p className="text-gray-700 mb-4">
            I am Halldór Hrafn Reynisson, a 17 (turning 18 as of writing this) year old developer from Iceland.
            I am currently studying computer science at FB in Reykjavík.
          </p>
        </div>
        <div className="max-w-3xl mx-auto m-10 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">Hobbies</h1>
          <p className="text-gray-700 mb-4">
            My hobbies are all over the place. But mainly include computer science and TTRPGs like D&D and Pathfinder.
            I also like reading Japanese light novels and manga, aswell as watching anime.
          </p>
        </div>
        <div className="max-w-3xl mx-auto m-10 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">What am I good at?</h1>
          <p className="text-gray-700 mb-4">
            I like to say that I am good at programming, but I am not confident that I am able to say
            that I'm good enough to work for a company yet. I am mostly exploring backend development aswell as low-level programming.
          </p>
        </div>
      </main>
      <main className="flex-1 flex flex-col items-center justify-center h-full">
        <form action={sendRequest} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold mb-6">Submit a Feature Request/Bug Report</h2>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
              Type:
            </label>
            <select
              id="type"
              name="type"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="feature">Feature Request</option>
              <option value="bug">Bug Report</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              rows={5}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
      </main>
    </div>
  );
}