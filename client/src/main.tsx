
import React from 'react'
import { createRoot } from 'react-dom/client'

function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 16 }}>
      <h1>VictorySync</h1>
      <p>Vite React client is working.</p>
      <p>
        If this is visible after building, the server is serving the SPA from
        <code>client/dist</code>.
      </p>
    </div>
  )
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
