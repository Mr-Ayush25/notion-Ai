import { connect } from "@/lib/db/connect";
import { Note } from "@/lib/model/Note";
import { generateImage, generateImagePrompt } from "@/lib/openAi/openAi";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const POST = async (req: Request) => {
  // auth from clerk server
  const { userId } = auth();
  if (!userId) {
    return new NextResponse("Unauthorised", { status: 401 });
  }

  const body = await req.json();
  // getting the name of note
  const { name } = body;

  try {
    // getting prompt for image
    const image_desc = await generateImagePrompt(name);
    if (!image_desc) {
      return new NextResponse("failed to generate the image description", {
        status: 500,
      });
    }
    // getting images url
    const image_url = await generateImage(image_desc);
    if (!image_url) {
      return new NextResponse("failed to generate the image", { status: 500 });
    }

    // creating note
    const note = {
      name,
      userId,
      imageUrl: image_url,
    };

    const newNote = new Note(note);
    await connect();
    const noteDetail = await newNote.save();

    return NextResponse.json(
      { notedId: noteDetail.id, imageUrl: noteDetail.imageUrl },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(error);
  }
};

export { POST };
