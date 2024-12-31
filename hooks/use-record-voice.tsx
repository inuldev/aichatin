"use client";

import OpenAI, { toFile } from "openai";
import { useEffect, useRef, useState } from "react";

import { usePreferences } from "./use-preferences";
import { blobToBase64, createMediaStream } from "@/lib/record";

interface UseRecordVoiceResult {
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  transcribing: boolean;
  text: string;
}

export const useRecordVoice = (): UseRecordVoiceResult => {
  const [text, setText] = useState<string>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [recording, setRecording] = useState<boolean>(false);
  const [transcribing, setTranscribing] = useState<boolean>(false);

  const { getApiKey } = usePreferences();
  const isRecording = useRef<boolean>(false);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async (): Promise<void> => {
    if (mediaRecorder) {
      isRecording.current = true;
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorder) {
      isRecording.current = false;
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const getText = async (base64data: string): Promise<void> => {
    try {
      setTranscribing(true);
      const apiKey = await getApiKey("openai");

      if (!apiKey) {
        throw new Error("API key not found");
      }

      const openai = new OpenAI({
        apiKey,
        dangerouslyAllowBrowser: true,
      });

      const audioBuffer = Buffer.from(base64data, "base64");
      const transcription = await openai.audio.transcriptions.create({
        file: await toFile(audioBuffer, "audio.wav", {
          type: "audio/wav",
        }),
        model: "whisper-1",
      });
      setTranscribing(false);
      setText(transcription?.text);
    } catch (error) {
      setTranscribing(false);
      console.error(error);
    }
  };

  const initialMediaRecorder = (stream: MediaStream): void => {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.onstart = () => {
      createMediaStream(stream, true, (peak) => {});
      chunks.current = [];
    };

    mediaRecorder.ondataavailable = (ev: BlobEvent) => {
      chunks.current.push(ev.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(chunks.current, { type: "audio/wav" });
      blobToBase64(audioBlob, getText);
    };

    setMediaRecorder(mediaRecorder);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(initialMediaRecorder)
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return {
    recording,
    startRecording,
    stopRecording,
    transcribing,
    text,
  };
};
