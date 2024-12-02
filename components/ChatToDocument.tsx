"use client";
import { FormEvent, useState, useTransition } from "react";
import * as Y from "yjs";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

const ChatToDocument = ({ doc }: { doc: Y.Doc }) => {
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [summary, setSummary] = useState("");
  const [question, setQuestion] = useState("");

  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();

    // Check if input is empty and show an error if so
    if (!input) {
      toast.error("Please enter a question before submitting.");
      return;
    }

    setQuestion(input);

    startTransition(async () => {
      try {
        const documentData = doc.get("document-store").toJSON();
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            documentData,
            question: input,
          }),
        });

        // Check for response status and handle errors
        if (!res.ok) {
          const { error } = await res.json();
          toast.error(`Failed to ask question: ${error || 'Unknown error'}`);
          return;
        }

        const { message } = await res.json();
        setInput("");
        setSummary(message);

        // Display success message
        toast.success("Question asked successfully");
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while asking the question. Please try again.");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <MessageCircleCode className="mr-2" />
          Chat to document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat to the document!</DialogTitle>
          <DialogDescription>
            Ask a question and chat to the document with AI.
          </DialogDescription>

          <hr className="mt-5" />

          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">
                AI {isPending ? "is thinking..." : "Says:"}
              </p>
            </div>
            <div>
              {isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}
            </div>
          </div>
        )}

        <form className="flex gap-2" onSubmit={handleAskQuestion}>
          <Input
            type="text"
            placeholder="i.e. what is this about?"
            className="w-full"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Ask a question to the document"
          />
          <Button type="submit" disabled={!input || isPending}>
            {isPending ? "Asking..." : "Ask"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatToDocument;
