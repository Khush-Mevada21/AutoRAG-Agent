import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";

export default function MessageBubble({ type, text }: { type: string, text: string }) {
  return (
    <div className={cn("flex items-start space-x-2", type === 'user' ? 'justify-end' : 'justify-start')}>
      {type === 'bot' && <Bot className="w-6 h-6 text-purple-600" />}
      <div className={cn(
        "rounded-xl px-4 py-2 max-w-md",
        type === 'user' ? "bg-blue-600 text-white" : "bg-gray-100 text-black"
      )}>
        {text}
      </div>
      {type === 'user' && <User className="w-6 h-6 text-blue-600" />}
    </div>
  );
}
