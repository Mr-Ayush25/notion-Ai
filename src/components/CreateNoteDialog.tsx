"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { useMutation } from "react-query";
import { useRouter } from "next/navigation";

import axios from "axios";

type Data = {
  notedId: string;
  imageUrl: string;
};

export default function CreateNoteDialog() {
  const [input, setInput] = useState("");

  // router
  const router = useRouter();

  // Creating a mutator function for creating Notebook
  const createNotebook = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/createNoteBook", {
        name: input,
      });
      return response.data;
    },
  });
  // Creating a mutator function for creating Notebook
  const updateToFirebase = useMutation({
    mutationFn: async (data: Data) => {
      const response = await axios.post("/api/uploadToFirebase", {
        data,
      });
      return response.data;
    },
  });

  // HandleSubmit
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    if (input === "") {
      window.alert("Please enter a name for your Notebook");
      return;
    }

    createNotebook.mutate(undefined, {
      onSuccess: ({ notedId, imageUrl }) => {
        router.push(`/notebook/${notedId}`);
        const data = { notedId, imageUrl };
        updateToFirebase.mutate(data);
      },
      onError: (err) => {
        window.alert("Failed to create new Notebook! Try again");
        console.error(err);
      },
    });
  };
  return (
    <Dialog>
      <DialogTrigger>
        <div className="border-dashed border-2 border-green-600 h-full rounded-lg flex items-center justify-center sm:flex-col hover:shadow-xl gap-2 transition hover:-translate-y-1  p-4">
          <Plus className="w-5 h-5 text-green-600" strokeWidth={3} />
          <h2 className="font-semibold lg:text-lg text-green-600">
            New NoteBook
          </h2>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">New Notebook</DialogTitle>
          <DialogDescription className="text-center">
            You can create a new note by clicking the button below
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Name..."
            required
            name="name"
          />
          <div className="flex items-center gap-2">
            <Button
              type="reset"
              onClick={() => setInput("")}
              variant="secondary"
            >
              Cancel
            </Button>
            <button
              type="submit"
              className="bg-green-600 flex justify-center items-center font-semibold hover:bg-black hover:text-white py-2 w-28  rounded-sm transition-all duration-150 ease-in-out"
              onClick={(e) => {
                handleSubmit(e);
                e.currentTarget.disabled = true;
              }}
            >
              {createNotebook.isLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Create
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
