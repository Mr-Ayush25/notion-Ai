import { connect } from "@/lib/db/connect";
import { uploadFileToFirebase } from "@/lib/firebase/firebase";
import { Note } from "@/lib/model/Note";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  const { data } = await req.json();
  const { notedId, imageUrl } = data;

  if (!notedId || !imageUrl) {
    return new NextResponse("No image url", { status: 400 });
  }

  try {
    const firebase_url = await uploadFileToFirebase(imageUrl, notedId);
    await connect();
    await Note.findByIdAndUpdate(notedId, { imageUrl: firebase_url });
    return new NextResponse("ok", { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
