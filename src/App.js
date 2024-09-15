import { useState } from 'react';
import './App.css';
import { OpenAI } from "openai";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import ActivityDashboard from './components/ActivityDashboard';
import SessionList from './components/SessionList'
import Chat from './components/Chat'

const OPENAI_API_KEY = "";

function App() {
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null); // Track which session is active
  const [typing, setTyping] = useState(false);
  const [showChart, setShowChart] = useState(false);

  // Start a new chat session
  const startNewChat = () => {
    const now = new Date();
    const newSession = { 
      id: sessions.length + 1, 
      name: `Session ${sessions.length + 1}`,
      messages: [{
        message: "Hello, I am ChatGPT!",
        sender: "ChatGPT",
        direction: "incoming",
        timeStamp: now
      }],
      lastMessageTime: now
    };
    setSessions([...sessions, newSession]); // Add new session to the list
    setActiveSession(newSession); // Set the newly created session as active
  };

  // Handle sending a message
  const handleSend = async (message) => {
    const now = new Date();
    const newMessage = 
      { message, 
      sender: "user", 
      direction: "outgoing",
      timeStamp: now
     };
    const updatedMessages = [...activeSession.messages, newMessage];

    // Update the active session's messages
    const updatedSession = { 
      ...activeSession, 
      messages: updatedMessages,
      lastMessageTime: now
     };
    const updatedSessions = sessions.map((session) =>
      session.id === activeSession.id ? updatedSession : session
    );

    setSessions(updatedSessions);
    setActiveSession(updatedSession);
    setTyping(true);

    await processMessageToChatGPT(updatedMessages, updatedSession);
  };

  async function processMessageToChatGPT(chatMessages, updatedSession) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message };
    });

    const systemMessages = {
      role: "system",
      content: ""
    };

    try {
      const response =  await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [systemMessages, ...apiMessages],
      });

      const chatGPTMessage = {
        message: response.choices[0].message.content,
        sender: "ChatGPT",
        direction: "incoming"
      };

      // Update the messages with ChatGPT response
      const updatedMessages = [...updatedSession.messages, chatGPTMessage];
      const finalSession = { ...updatedSession, messages: updatedMessages };
      const finalSessions = sessions.map((session) =>
        session.id === finalSession.id ? finalSession : session
      );
      
      setSessions(finalSessions);
      setActiveSession(finalSession);
      setTyping(false);
    }
    catch (error) {
      console.error("Error processing message with ChatGPT:", error);
      setTyping(false);
    }
  }

  return (
    <div className="app-container">
      <SessionList 
        sessions={sessions}
        setActiveSession={setActiveSession}
        startNewChat={startNewChat}
        toggleChart={() => setShowChart(!showChart)}
        setShowChart={showChart}
      />

      <div className="chat-container">
        {showChart ? (
            <ActivityDashboard sessions={sessions}/>
          ) : (
            activeSession ? (
              <Chat 
                activeSession={activeSession}
                handleSend={handleSend}
                typing={typing}
              />
            ) : (
              <div className="no-session-selected">
                <h2>Select or start a session</h2>
              </div>
            )
          )
        }
      </div>
    </div>
  );
}

export default App;