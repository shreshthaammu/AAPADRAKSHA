import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  User,
  RotateCcw,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { ZoneData, StateProfile } from "../types";
import { askAIAssistant } from "../services/api";

interface AIAssistantPageProps {
  selectedZone: ZoneData;
  selectedState: StateProfile;
  selectedDistrict: string;
  onNavigateTab: (tab: any) => void;
}

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
}

export const AIAssistantPage: React.FC<AIAssistantPageProps> = ({
  selectedZone,
  selectedState,
  selectedDistrict,
  onNavigateTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "assistant",
      text: `Hello! I am AAPADRAKSHA AI, your dedicated disaster management assistant. I am currently monitoring hydrological sensors for ${selectedZone.name}, ${selectedDistrict} (Rainfall: ${selectedZone.rainfall} mm, Flood Risk: ${selectedZone.floodProb}%). How can I assist you with safety protocols, shelter navigation, or flood prep today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const suggestionChips = [
    "Is my area safe right now?",
    "Where is the nearest high-ground relief shelter?",
    "What should I pack in an emergency grab bag?",
    "What to do if floodwater enters my home?",
    "Are the bridges and causeways over the river closed?"
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    try {
      const response = await askAIAssistant(
        textToSend,
        `Current Zone: ${selectedZone.name}, District: ${selectedDistrict}, State: ${selectedState.name}, Rainfall: ${selectedZone.rainfall}mm, Flood Probability: ${selectedZone.floodProb}%, Depth: ${selectedZone.depth}m, Risk: ${selectedZone.risk}`
      );

      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: "assistant",
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "assistant",
          text: "I experienced a temporary network issue contacting the knowledge base. However, for immediate flood danger in your zone, please evacuate to higher ground or dial 112 directly.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const speakMessage = (id: string, text: string) => {
    if (!window.speechSynthesis) return;

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    setSpeakingId(id);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div id="ai-assistant-page" className="space-y-4 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              AI Disaster Management Assistant
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-purple-500" />
              <span>Gemini Powered</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            24x7 intelligent conversational guidance grounded in official NDMA protocols & real-time telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Grounded Zone:</span>
          <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
            {selectedZone.name} ({selectedZone.risk})
          </span>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="h-[calc(100vh-16rem)] min-h-[500px] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(msg => {
            const isAssistant = msg.sender === "assistant";

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}
              >
                {isAssistant && (
                  <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0 shadow-xs mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isAssistant
                      ? "bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-slate-800 dark:text-slate-200"
                      : "bg-blue-600 text-white font-medium shadow-xs"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {isAssistant && (
                      <button
                        onClick={() => speakMessage(msg.id, msg.text)}
                        className="flex items-center gap-1 text-slate-500 hover:text-purple-600 transition-colors p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                        title="Read aloud voice synthesis"
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span>{speakingId === msg.id ? "Stop Voice" : "Listen"}</span>
                      </button>
                    )}
                  </div>
                </div>

                {!isAssistant && (
                  <div className="p-2 rounded-xl bg-blue-700 text-white shrink-0 shadow-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-purple-600 text-white shrink-0 shadow-xs mt-1">
                <Bot className="w-4 h-4" />
              </div>
              <div className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce delay-200" />
                <span>AAPADRAKSHA AI is reasoning over hydrological rules...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs whitespace-nowrap">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0">Suggestions:</span>
          {suggestionChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 text-slate-600 dark:text-slate-300 text-[11px] transition-colors shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Ask anything regarding flood safety in ${selectedZone.name}...`}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-purple-500 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
          />

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-all shadow-xs shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
