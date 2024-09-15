import React from 'react';

function SessionList({ sessions, setActiveSession, startNewChat, toggleChart, showChart }) {
  return (
    <div className="sessions-list">
      <h3>Sessions</h3>
      <ul>
        {sessions.map((session) => (
          <li key={session.id} onClick={() => setActiveSession(session)}>
            {session.name}
          </li>
        ))}
      </ul>
      <button onClick={startNewChat}>Start New Chat</button>
      <button onClick={toggleChart}>
        {showChart ? "Hide Chart" : "Show Chart"}
      </button>
    </div>
  );
}

export default SessionList;