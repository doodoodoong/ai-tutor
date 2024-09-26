import React from "react";
import Link from "next/link";
import Image from "next/image";

const IntroPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center mb-8">
        <h1 className="text-6xl font-bold mb-2">증도GPT</h1>
        <h2 className="text-2xl">공부하다 필요할 때 도움을 받읍시다!</h2>
      </div>
      <div className="mb-8">
        <Image
          src="/intro-image.jpg"
          alt="Intro Image"
          width={400}
          height={300}
          className="rounded-lg shadow-lg border-2 border-white"
        />
      </div>
      <Link
        href="/chat"
        className="bg-purple-600 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-purple-700 transition-colors shadow-lg"
      >
        Get Started
      </Link>
    </div>
  );
};

export default IntroPage;
