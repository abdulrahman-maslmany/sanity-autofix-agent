// web/src/app/page.tsx
'use client'

import { useState } from 'react'
import { Send, Bot, User, Car, Wrench, ShieldCheck } from 'lucide-react'

export default function Home() {
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; content: string }[]>([
    {
      role: 'agent',
      content: '👋 Welcome to the **AutoFix & Compatibility Agent**! Powered by Sanity Structured Data. Ask me about car issues (like OBD codes) or part compatibility.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        { role: 'agent', content: data.reply || 'No response received from agent.' },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'agent', content: '❌ Error contacting the AI agent.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AutoFix Knowledge Agent</h1>
            <p className="text-xs text-slate-400">Sanity Challenge 2026 • Real Structured Content</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Sanity Lake Connected
        </span>
      </div>

      {/* Suggestion Chips */}
      <div className="w-full max-w-4xl flex flex-wrap gap-2 mb-4">
        {[
          'I have error code P0300, what parts do I need?',
          'Is SK16R11 compatible with Toyota Camry 2023?',
          'Which spark plugs fit Toyota Corolla 2020?',
        ].map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setInput(prompt)}
            className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 transition"
          >
            💡 {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="w-full max-w-4xl flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-4 min-h-[420px] max-h-[500px]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role === 'agent' && (
              <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-blue-400" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800/80 border border-slate-700/50 text-slate-200 rounded-bl-none'
              }`}
            >
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-blue-400" />
            </div>
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-bl-none px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
              <span className="animate-spin">⚙️</span> Querying Sanity Knowledge Lake...
            </div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="w-full max-w-4xl mt-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about vehicle issues, error codes, or part compatibility..."
          className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 rounded-xl font-medium flex items-center justify-center transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </main>
  )
}