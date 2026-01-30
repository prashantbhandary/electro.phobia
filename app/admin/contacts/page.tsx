'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { contactAPI, isAuthenticated } from '@/lib/api'
import LoadingSpinner from '@/components/LoadingSpinner'

interface Contact {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  ipAddress?: string
  createdAt: string
}

export default function ContactMessages() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/admin/login')
      return
    }
    fetchContacts()
  }, [router])

  const fetchContacts = async () => {
    try {
      const data = await contactAPI.getAll()
      setContacts(data)
    } catch (error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await contactAPI.updateStatus(id, status)
      setContacts(contacts.map(c => 
        c._id === id ? { ...c, status: status as any } : c
      ))
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this message?')) return
    
    try {
      await contactAPI.delete(id)
      setContacts(contacts.filter(c => c._id !== id))
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const filteredContacts = contacts.filter(c => 
    filter === 'all' || c.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'read': return 'bg-yellow-100 text-yellow-800'
      case 'replied': return 'bg-green-100 text-green-800'
      case 'archived': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Contact Messages
          </h1>
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'new', 'read', 'replied', 'archived'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'all' && ` (${contacts.length})`}
              {status !== 'all' && ` (${contacts.filter(c => c.status === status).length})`}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="space-y-4">
          {filteredContacts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No messages found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact._id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {contact.name}
                      </h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(contact.status)}`}>
                        {contact.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {contact.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {new Date(contact.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Subject: {contact.subject}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {contact.message}
                  </p>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <a
                    href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                    className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/90 text-sm"
                  >
                    Reply via Email
                  </a>
                  
                  {contact.status !== 'read' && (
                    <button
                      onClick={() => updateStatus(contact._id, 'read')}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
                    >
                      Mark as Read
                    </button>
                  )}
                  
                  {contact.status !== 'replied' && (
                    <button
                      onClick={() => updateStatus(contact._id, 'replied')}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                    >
                      Mark as Replied
                    </button>
                  )}
                  
                  <button
                    onClick={() => updateStatus(contact._id, 'archived')}
                    className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                  >
                    Archive
                  </button>
                  
                  <button
                    onClick={() => deleteContact(contact._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm ml-auto"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
