import { connect } from "@/lib/db/connect";
import { Note } from "@/lib/model/Note";
import { NextResponse } from "next/server";

export const preventSSG = true;

export const POST = async (req: Request) => {
  const body = await req.json();

  let { noteId, editorState } = body;

  // If any of dependency is empty
  if (!noteId || editorState === "") {
    return NextResponse.json(
      { message: "NoteId Or EditorState is Unavailable" },
      {
        status: 400,
      }
    );
  }

  try {
    await connect();
    const note = await Note.findById(noteId);

    if (!note) {
      return new NextResponse("Failed to update", { status: 500 });
    }

    if (note.editorState !== editorState) {
      await Note.findByIdAndUpdate(noteId, { editorState });

      return NextResponse.json({ success: true }, { status: 200 });
    }
    return NextResponse.json(
      { message: "Note is already updated" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
};
