import React, { useState } from 'react'
import PortfolioCMS from './PortfolioCMS'

type Props = {
  open: boolean
  onClose: () => void
}

export default function AdminModal({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'settings'>('portfolio')

  if (!open) return null

  return (
    <>
      {activeTab === 'portfolio' ? (
        <PortfolioCMS 
          isOpen={open} 
          onClose={onClose}
        />
      ) : (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 p-6 rounded shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Admin Settings</h3>
              <button onClick={onClose} className="text-gray-600">Close</button>
            </div>

            <div className="flex space-x-4 mb-6">
              <button 
                onClick={() => setActiveTab('portfolio')}
                className={`px-4 py-2 rounded ${activeTab === 'portfolio' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Portfolio CMS
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 rounded ${activeTab === 'settings' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Settings
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-700">General site settings and configuration.</p>

              <div className="border p-4 rounded">
                <label className="block text-sm mb-2">Site Title</label>
                <input className="w-full p-2 border rounded" placeholder="OSO FILM" />
              </div>

              <div className="border p-4 rounded">
                <label className="block text-sm mb-2">Contact Email</label>
                <input className="w-full p-2 border rounded" placeholder="contact@osofilm.com" />
              </div>

              <div className="flex justify-end">
                <button className="px-4 py-2 bg-gray-200 mr-2" onClick={onClose}>Cancel</button>
                <button className="px-4 py-2 bg-black text-white">Save Settings</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
