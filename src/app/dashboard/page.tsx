import CreateNoteDialog from "@/components/CreateNoteDialog";
import { Button } from "@/components/ui/button";
import { connect } from "@/lib/db/connect";
import { Note } from "@/lib/model/Note";
import { UserButton, auth } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Dashboard = async () => {
  const { userId } = auth();
  await connect();
  const notes = await Note.find({ userId });

  return (
    <div className="grainy min-h-screen">
      <div className="max-w-7xl mx-auto p-10">
        <div className="h-14" />
        <div className="flex justify-center items-center max-md:flex-col">
          <div className="flex justify-center items-center">
            <Link href="/">
              <Button className="bg-green-600" size="sm">
                <ArrowLeft className="mr-1 w-4 h-4" />
                Back
              </Button>
            </Link>
            <div className="w-4" />
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
              <div className="w-4"></div>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
        <hr className="my-8" />
        {/* List all The notes */}

        {notes?.length === 0 && (
          <h2 className="text-xl my-5 text-center text-gray-400">
            You have no notes yet.
          </h2>
        )}

        {/* Display all notes */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <CreateNoteDialog />
          {notes?.length !== 0 &&
            notes?.map((note) => (
              <Link key={note._id} href={`/notebook/${note._id}`}>
                <div className="overflow-hidden flex flex-col border border-stone-300 hover:shadow-xl rounded-lg transition hover:-translate-y-1 ">
                  <div className="relative w-full">
                    <Image
                      src={note.imageUrl}
                      alt={note.name}
                      height={200}
                      width={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {note.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
