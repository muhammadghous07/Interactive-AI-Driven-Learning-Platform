import { useAITeacher } from "@/hooks/useAITeacher";
import { useState } from "react";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { Mic, MicOff, Volume2 } from "lucide-react";
import TextShow from "./TextShow";

export const TypingBox = () => {
  const askAI = useAITeacher((state) => state.askAI);
  const loading = useAITeacher((state) => state.loading);
  const messages = useAITeacher((state) => state.messages);
  const [question, setQuestion] = useState("");
  const [isListening, setIsListening] = useState(false);

  const ask = () => {
    askAI(question);

    setQuestion("");
  };

  const startListening = async () => {
    setIsListening(true);

    const speechTranslationConfig = sdk.SpeechTranslationConfig.fromSubscription(
      "ELz0Hxk4aSY05GHdGyciVb3CBhDNl111Zt172eZJtk3UFKd92QeaJQQJ99BFACYeBjFXJ3w3AAAEACOGcssA",
      "eastus"
    );

    const languages = ["en-GB", "ur-IN"];
    let recognized = false;

    for (const lang of languages) {
      speechTranslationConfig.speechRecognitionLanguage = lang;
      speechTranslationConfig.addTargetLanguage("en-US");
      speechTranslationConfig.addTargetLanguage("en-GB");
      speechTranslationConfig.addTargetLanguage("ur-IN");

      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const translationRecognizer = new sdk.TranslationRecognizer(speechTranslationConfig, audioConfig);

      await new Promise((resolve) => {
        translationRecognizer.recognizeOnceAsync(result => {
          if (result.reason === sdk.ResultReason.TranslatedSpeech) {
            const recognizedQuestion = result.translations.get("en"); // Always use the English translation
            setQuestion(recognizedQuestion);
            askAI(recognizedQuestion); // Directly ask the AI with the recognized question
            recognized = true;
            setQuestion("");
          } else if (result.reason !== sdk.ResultReason.NoMatch) {
            console.error("Speech recognition failed:", result);
            alert(`Speech recognition failed: ${result.reason}`);
          }
          resolve();
        });
      });

      if (recognized) break; // Exit the loop if a question is recognized
    }

    setIsListening(false);
  };



  console.log("This is ques" + question)



  return (
    <div className="z-10 lg:fixed lg:top-4 lg:left-4  xl:max-w-[600px] lg:max-w-[400px] lg:max-h-full max-h-[250px] mx-auto flex flex-col space-y-0 bg-gradient-to-tr from-blue-300 via-gray-400 to-slate-600-400/30 p-2 md:p-4 sm:p-6 backdrop-blur-md rounded-xl border border-slate-100/30">
      <div>
        <div className="hidden md:block  flex-col space-y-2">
          <h2 className="text-white font-bold 2xl:text-lg md:text-sm text-xs">
            Ask your question
          </h2>
          <p className="text-white/65 2xl:text-lg md:text-sm text-xs">
            Type your problem and AI will provide you solution
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
            </span>
          </div>
        ) : (
          <>
            <div>
              <TextShow />
            </div>
            <div className="flex flex-row justify-evenly mt-0 md:mt-2 2xl:mt-6 items-center space-y-4 md:space-y-0 md:space-x-20 2xl:space-x-5">
              <div className="flex flex-col  text-xs  md:text-lg space-y-2 md:space-y-1 2xl:space-y-4 flex-grow">
                <input
                  className="w-full 2xl:text-lg md:text-sm text-xs focus:outline focus:outline-white/80 bg-slate-800/60 md:p-1 2xl:px-2 px-2 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
                  placeholder="Say Hello"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      ask();
                    }
                  }}
                />
                <button
                  className="w-full bg-slate-100/20 md:p-1 px-6 rounded-full text-white 2xl:text-lg md:text-sm text-xs"
                  onClick={ask}
                >
                  Ask
                </button>
              </div>
              <div className="flex flex-col items-center space-y-0 md:space-y-3">
                <button
                  onClick={startListening}
                  disabled={isListening}
                  className="flex w-10 h-10 md:w-10 md:h-10 2xl:h-20 2xl:w-20 items-center justify-center rounded-full bg-slate-100/20 hover:bg-slate-100/40 text-primary-foreground shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  {isListening ? (
                    <Mic className="w-5 h-5 animate-pulse" />
                  ) : (
                    <MicOff className="w-5 h-5 md:w-5 md:h-5 2xl:h-10 2xl:w-10" />
                  )}
                </button>
                <div className="text-center">
                  <p className="2xl:text-lg md:text-sm text-xs font-semibold">
                    {isListening ? "I'm listening..." : "Click to speak "}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};