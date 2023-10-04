import TypewriterTitle from "@/components/TypewriterTitle";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <section className="bg-gradient-to-br min-h-screen from-rose-100 to-teal-100 grainy">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2">
        <h1 className="font-semibold text-6xl font-[futura] text-center">
          AI <span className="text-green-600">note taking </span>Assistant
        </h1>
        <div className="mt-4"></div>
        <h2 className="font-semibold text-3xl text-center text-slate-700">
          <TypewriterTitle />
        </h2>
        <div className="mt-8" />
        <div className="flex justify-center">
          <Link href="/dashboard">
            <Button className="bg-green-600">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" strokeWidth={3} />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
