import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AiAssistantProps {
  open: boolean;
  onClose: () => void;
}

export function AiAssistant({ open, onClose }: AiAssistantProps) {
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([
    {
      role: "ai",
      text: "Hi 👋 I’m SpotLight AI. Ask me about parking, traffic, or routes!",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg = { role: "user" as const, text: input };
    const aiMsg = {
      role: "ai" as const,
      text: "🤖 AI is analyzing your request... (demo response)",
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-[9999]"
        >
          <Card className="w-[340px] h-[420px] rounded-2xl shadow-2xl border border-border flex flex-col bg-background">

            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <Bot className="text-primary h-5 w-5" />
                <span className="font-semibold">SpotLight AI</span>
              </div>
              <Button size="icon" variant="ghost" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded-xl max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-primary text-white ml-auto"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t flex gap-2">
              <Input
                placeholder="Ask about parking..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
