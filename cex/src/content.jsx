import React from 'react'
import ReactDOM from 'react-dom/client'
import './content.css'

const root = document.createElement('div')
root.id = 'memetics-crx-root'
document.body.prepend(root)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <div>This is from the memetics downloader content script...</div>
  </React.StrictMode>
)
