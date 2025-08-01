"use client";

import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, RefreshCw, Sparkles } from "lucide-react";

export function CustomChatInterface() {
  const { visibleMessages, appendMessage, isLoading, reset } = useCopilotChat();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages]);

  const sendMessage = (content: string) => {
    if (content.trim()) {
      appendMessage(
        new TextMessage({ content: content.trim(), role: Role.User })
      );
      setInputValue("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /`(.*?)`/g,
        '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>'
      )
      .replace(/\n/g, "<br />");
  };

  return (
    <div className="flex flex-col h-full max-h-[740px] mt-2 ml-4 mr-4  bg-background overflow-hidden rounded-xl border border-border shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">
              Causely AI Assistant
            </h2>
            <p className="text-xs text-muted-foreground">
              Powered by advanced AI
            </p>
          </div>
        </div>
        <button
          onClick={reset}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          title="Reset conversation"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
        {visibleMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-fade-in-up animation-delay-200">
            <div className="p-4 bg-primary/10 rounded-full">
              <Bot className="h-10 w-10 text-primary" />
            </div>
            <div className="space-y-3 max-w-xl">
              <h3 className="text-2xl font-bold text-foreground">
                Welcome to Causely!
              </h3>
              <p className="text-base text-muted-foreground leading-relaxed">
                I&apos;m here to help you with your philanthropic journey. Ask
                me anything about giving, impact measurement, or finding the
                right causes to support.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl w-full">
              {[
                "How can I start giving?",
                "What causes should I support?",
                "How do I measure impact?",
                "Tell me about effective altruism",
              ].map((suggestion, index) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="p-3 text-left bg-card border border-border hover:bg-primary/5 hover:border-primary/20 text-foreground rounded-lg transition-all animate-fade-in-up hover:scale-105"
                  style={{ animationDelay: `${400 + index * 100}ms` }}
                >
                  <div className="font-medium text-sm">{suggestion}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          visibleMessages.map((message, index) => {
            // Type assertion to access message properties
            const messageAny = message as unknown as {
              role: string;
              content: string;
              id: string;
            };
            const isUser = messageAny.role === Role.User;
            const isAssistant = messageAny.role === Role.Assistant;
            const content = messageAny.content || "";

            return (
              <div
                key={message.id}
                className={`flex gap-3 animate-fade-in-up ${
                  isUser ? "justify-end" : "justify-start"
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {isAssistant && (
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    isUser
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-card border border-border text-foreground"
                  } shadow-sm`}
                >
                  <div className="flex items-start gap-2">
                    {isUser && (
                      <div className="flex-shrink-0 p-1 bg-primary-foreground/20 rounded-full">
                        <User className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: formatMessage(content),
                      }}
                    />
                  </div>
                </div>

                {isUser && (
                  <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in-up">
            <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-card border border-border text-foreground p-4 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border bg-card p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about philanthropy, impact, or giving..."
              className="w-full px-4 py-3 pr-12 bg-muted/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        {/* Quick actions */}
        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Press Enter to send</span>
            <span>•</span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
