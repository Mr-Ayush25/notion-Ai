import { connect } from "@/lib/db/connect";
import { Note } from "@/lib/model/Note";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { clerkClient } from "@clerk/nextjs";
import TipTapEditor from "@/components/tiptapeditor/TipTapEditor";
import DeleteButton from "@/components/tiptapeditor/DeleteButton";

type Props = {
  params: {
    noteId: string;
  };
};

const NotebookPage = async ({ params: { noteId } }: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/dashboard");
  }

  const user = await clerkClient.users.getUser(userId);

  let notes;
  try {
    await connect();
    notes = await Note.findById(noteId);
    if (!notes) {
      return redirect("/dashboard");
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="min-h-screen grainy p-8">
      {notes && (
        <div className="max-w-4xl mx-auto">
          {/* Upper section with button */}
          <div className="flex items-center justify-between  rounded-lg border-stone-200 shadow-lg p-4 cursor-pointer mb-10 md:mb-14">
            <div className="flex justify-center items-center gap-4">
              <a href="/dashboard">
                <Button className="bg-green-600" size="sm">
                  Back
                </Button>
              </a>
              {user?.firstName && (
                <span className="font-semibold">{user.firstName}</span>
              )}
              <span className="text-gray-500 font-semibold">
                {" "}
                / {notes?.name}
              </span>
            </div>
            <DeleteButton noteId={JSON.parse(JSON.stringify(notes._id))} />
          </div>
          {/* Editor */}
          <div className="border-stone-200 min-h-[500px] shadow-xl border rounded-lg md:px-16 px-4 py-8 w-full">
            {/* what we did below cause we can't pass directly a object from server-component to client so we are creating a deep copy of it */}
            <TipTapEditor notes={JSON.parse(JSON.stringify(notes))} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NotebookPage;
