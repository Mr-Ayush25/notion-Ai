"use client";
import React from "react";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { useMutation } from "react-query";
import axios from "axios";
import { useRouter } from "next/navigation";

type Props = {
  noteId: string;
};

const DeleteButton = ({ noteId }: Props) => {
  const router = useRouter();

  const deleteNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/deleteNote", {
        noteId,
      });
      return response.data;
    },
  });

  const handleDelete = () => {
    deleteNote.mutate(undefined, {
      onSuccess: () => {
        router.refresh();
        router.push("/dashboard");
      },
    });
  };
  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => {
        const confirm = window.confirm("Are you sure want to delete this Note");
        if (!confirm) return;
        handleDelete();
      }}
    >
      <Trash />
    </Button>
  );
};

export default DeleteButton;
