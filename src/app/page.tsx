import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <div className="bg-indigo-600 p-4 rounded-full">
            <BookOpen className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
          Welcome to ZipNotes
        </h1>

        <p className="text-xl text-gray-600 mb-8">
          Capture your thoughts, organize your ideas, and never lose a note again.
          A simple, elegant note-taking app for the modern thinker.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/sign-up">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              Sign In
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Rich Editing
            </h3>
            <p className="text-gray-600">
              Write and format notes with powerful text editing tools.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🗂️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Organize
            </h3>
            <p className="text-gray-600">
              Keep your notes organized in a clean, intuitive interface.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">☁️</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Cloud Sync
            </h3>
            <p className="text-gray-600">
              Access your notes from anywhere, anytime, on any device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
