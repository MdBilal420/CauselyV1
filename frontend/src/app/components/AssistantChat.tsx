import { AssistantMessageProps } from "@copilotkit/react-ui";
import { Markdown } from "@copilotkit/react-ui";

export function AssistantMessage({ message, subComponent, isLoading,...props }: AssistantMessageProps) {

    const messageData = message === "Hi! 👋 How can I assist you today?" ?  message : message ? JSON.parse(message ?? "{}").data.summary : {};

    return (
      <div className="flex items-start gap-4 py-2">
        {/* Avatar */}
        <div className="shrink-0 w-12 h-10 rounded-xl overflow-hidden bg-primary/10">
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 4L14 6H18C19.1046 6 20 6.89543 20 8V17C20 18.1046 19 18.1046 18 19H6C4.89543 19 4 18.1046 4 17V8C4 6.89543 4.89543 6 6 6H10L12 4Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 14C9 14 10 15 12 15C14 15 15 14 15 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M9 11H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M15 11H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Message */}
        {(message || isLoading) && (
          <div className="relative py-2 px-4 rounded-2xl rounded-tl-sm max-w-[100%] text-sm leading-relaxed">
            {/* <div className="font-medium text-primary mb-1">Fio</div> */}
            {isLoading ? (
              <div className="flex items-center gap-2 p-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              </div>
            ) : (
              <>{messageData && <Markdown content={messageData ?? ""} />}</>
            )}
          </div>
        )}
        {subComponent}
      </div>
    );
  }