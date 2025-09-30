import React from 'react'

type Props = {
  onOpenEditor: () => void
}

export default function AdminPanel({ onOpenEditor }: Props) {
  return (
    <div className="p-6 border-2 border-dashed border-gray-300 mt-8">
      <h3 className="text-xl font-bold mb-2">Admin Panel (Placeholder)</h3>
      <p className="text-sm text-gray-600">Admin features will be implemented here. You are currently signed in.</p>
      <div className="mt-4 space-x-2">
        <button onClick={onOpenEditor} className="px-3 py-1 bg-black text-white">Manage Content</button>
        <button className="px-3 py-1 border">Settings (TBD)</button>
      </div>
    </div>
  )
}
