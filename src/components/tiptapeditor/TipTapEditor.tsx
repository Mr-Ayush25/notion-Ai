"use client";
import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import TipTapMenu from "./TipTapMenu";
import { Button } from "../ui/button";
import useDebounce from "@/lib/useDebounce";
import { useMutation } from "react-query";
import Text from "@tiptap/extension-text";
import axios from "axios";
import { useCompletion } from "ai/react";

type Props = {
  notes: Notes;
};

const TipTapEditor = ({ notes }: Props) => {
  const [editorState, setEditorState] = React.useState(
    notes.editorState ?? "<h3>Notes</h3>"
  );

  // For auto complete feature
  const { complete, completion } = useCompletion({
    api: "/api/completion",
  });

  // For using shortcut keyboard
  const customText = Text.extend({
    addKeyboardShortcuts() {
      return {
        "Shift-a": () => {
          // Taking last 30 words.
          const prompt = this.editor.getText().split(" ").slice(-30).join(" ");
          // Auto complete AI calling complete function
          complete(prompt);
          return true;
        },
      };
    },
  });

  // Creating the editor
  const editor = useEditor({
    autofocus: true,
    // For Style inside editor
    editorProps: {
      attributes: {
        class: "leading-6 lg:leading-7  w-full",
      },
    },
    extensions: [
      StarterKit.configure({
        // Beacuse we configuring text on our own.
        text: false,
      }),
      customText,
      // To add a place holder
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "Start writing here",
      }),
    ],
    content: editorState,
    // To upadate the content
    onUpdate: ({ editor }) => {
      setEditorState(editor.getHTML());
    },
  });

  // For implementing the Stream effect of text.

  // 1.To hold the last completeion value.
  const lastCompletion = useRef("");

  // 2. Using useeffect to compare from last value to current value of completion. Saving the calue to editor
  useEffect(() => {
    if (!completion || !editor) return;
    const diff = completion.slice(lastCompletion.current.length);
    // Updating the lastcompletion
    lastCompletion.current = completion;
    editor?.commands.insertContent(diff);
  }, [completion, editor]);

  // Save Note Function
  const saveNote = useMutation({
    mutationFn: async () => {
      const response = await axios.post("/api/saveNote", {
        noteId: notes._id,
        editorState,
      });
      return response.data;
    },
  });

  // To Save in db
  const debounceEditorState = useDebounce(editorState, 1000);
  useEffect(() => {
    if (!debounceEditorState) {
      return;
    }
    // In below we are passing undefined cause we're not providing anything to above mutator function
    saveNote.mutate(undefined, {
      onSuccess: (data) => {
        console.log("Succes Update !", data);
      },
      onError: (err: any) => {
        console.error(err);
        window.alert(err.response.data.message);
      },
    });
  }, [debounceEditorState]);

  return (
    <>
      <div className="flex justify-between flex-col md:flex-row">
        {editor && <TipTapMenu editor={editor} />}
        <div className="flex justify-center max-md:mt-2">
          <Button
            disabled={saveNote.isLoading}
            variant="outline"
            className="h-10 w-40"
          >
            {saveNote.isLoading ? "Saving" : "Save"}
          </Button>
        </div>
      </div>
      <div className="prose-lg max-md:prose-sm ">
        <EditorContent editor={editor} />
      </div>
      <span className="mt-4 text-black font-thin">
        Tip: Press
        <kbd className="mx-2 px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-500 rounded-md">
          Shift + a
        </kbd>
        for AI autocomplete
      </span>
    </>
  );
};

export default TipTapEditor;
