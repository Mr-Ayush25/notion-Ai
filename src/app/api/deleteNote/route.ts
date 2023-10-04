import { connect } from "@/lib/db/connect";
import { Note } from "@/lib/model/Note";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { noteId } = await req.json();

  try {
    await connect();
    const deletedNote = await Note.findByIdAndDelete(noteId);
    if (!deletedNote) {
      return new NextResponse("Something went wrong", { status: 500 });
    }
    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
};
