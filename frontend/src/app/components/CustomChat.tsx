import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
 
export function CustomChatInterface() {
  const {
    visibleMessages,
    appendMessage,
    setMessages,
    deleteMessage,
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat();
 
  const sendMessage = (content: string) => {
    appendMessage(new TextMessage({ content, role: Role.User }));
  };
 
  return (
    <div>
hello
    </div>
  );
}