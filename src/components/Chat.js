import React from 'react';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';

function Chat({ activeSession, handleSend, typing }) {
  return (
    <MainContainer>
      <ChatContainer>
        <MessageList
          scrollBehavior="smooth"
          typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}
        >
          {activeSession.messages.map((message, i) => (
            <Message key={i} model={message} />
          ))}
        </MessageList>
        <MessageInput placeholder="Type message here" onSend={handleSend} />
      </ChatContainer>
    </MainContainer>
  );
}

export default Chat;


