import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  const [code, setCode] = useState(`function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(``)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    prism.highlightAll()
  }, [review])

  async function reviewCode(e) {
    e.preventDefault() // ✅ prevent reload
    setLoading(true)
    setError(null)
    try {
      const response = await axios.post('http://localhost:3000/ai/get-review', { code })
      setReview(response.data)
    } catch (err) {
      setError("❌ Failed to fetch review. Please check server connection.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-container">
  <div className="left-pane">
    <h2>🧠 Write Your Code</h2>
    <div className="code-editor">
      <Editor
        value={code}
        onValueChange={setCode}
        highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
        padding={10}
        style={{ minHeight: '400px' }}
      />
    </div>
    <button onClick={reviewCode} className="review-button" disabled={loading}>
      {loading ? "⏳ Reviewing..." : "🧪 Review Code"}
    </button>
    {error && <div className="error-message">{error}</div>}
  </div>

  <div className="right-pane">
    <h2>🔍 Code Review Result</h2>
    <div className="review-output">
      <Markdown rehypePlugins={[rehypeHighlight]}>
        {review || "*No review yet. Click the button above.*"}
      </Markdown>
    </div>
  </div>
</main>

  )
}

export default App
