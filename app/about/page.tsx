import React from 'react';
import Navbar from '@/components/Navbar';

export default async function Page() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-3xl mx-auto m-20 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">About Me</h1>
          <p className="text-gray-700 mb-4">
            You want to know more about me? Well, you have stumbled upon the right place my friend.
          </p>
        </div>
        <div className="max-w-3xl mx-auto m-20 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">Who am I?</h1>
          <p className="text-gray-700 mb-4">
            I am Halldór Hrafn Reynisson, a 17 (turning 18 as of writing this) year old developer from Iceland.
            I am currently studying computer science at FB in Reykjavík.
          </p>
        </div>
        <div className="max-w-3xl mx-auto m-20 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">Hobbies</h1>
          <p className="text-gray-700 mb-4">
            My hobbies are all over the place. But mainly include computer science and TTRPGs like D&D and Pathfinder.
            I also like reading Japanese light novels and manga, aswell as watching anime.
          </p>
        </div>
        <div className="max-w-3xl mx-auto m-20 bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-4">What am I good at?</h1>
          <p className="text-gray-700 mb-4">
            I like to say that I am good at programming, but I am not confident that I am able to say
            that I'm good enough to work for a company yet. I am mostly exploring backend development aswell as low-level programming.
          </p>
        </div>
      </main>
    </div>
  );
}