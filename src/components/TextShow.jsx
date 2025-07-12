import React from "react";
import { useAITeacher } from "@/hooks/useAITeacher";
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown";

export default function TextShow() {
  const llmResponse = useAITeacher((state) => state.llmResponse);
  const askQuestion = useAITeacher((state) => state.askQuestion);
  const loading = useAITeacher((state) => state.loading);


  return (
    <div className="max-w-[600px]">
      
      <div className="">
        
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : llmResponse ? (
            <>
            <h1 className="text-xs 2xl:text-lg md:text-sm font-semibold text-white mb-2 md:pt-3 ">Your Question</h1>
            <ScrollArea  className="h-[60px] 2xl:h-1/2 text-xs 2xl:text-lg bg-slate-800/60 text-white md:text-sm rounded-md border p-2 2xl:p-4 ">{askQuestion}</ScrollArea>
            <h2 className="text-xs 2xl:text-lg md:text-sm font-semibold text-white p-1 md:mb-2">AI Tutor Response:</h2>
             <ScrollArea className="h-[60px] 2xl:h-96 text-xs 2xl:text-lg md:text-sm bg-slate-800/60 rounded-md border p-2 2xl:p-4 text-white">
              <ReactMarkdown>{llmResponse}</ReactMarkdown>
            </ScrollArea>
            </>
        ) : (
          <p className="text-gray-400"></p>
        )}
      </div>
    </div>
  );
}
