'use client'

import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { ChevronLeft } from 'lucide-react'

interface TicketDetailsPanelProps {
  onBack: () => void
}

export function TicketDetailsPanel({ onBack }: TicketDetailsPanelProps) {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: {
      assignee: 'Jane Doe',
      team: 'Customer Service',
      status: 'Open',
      priority: 'medium',
      subject: 'Request about Pending Transaction',
      note: 'The customer has a pending transaction of about ₦45,000',
    },
  })

  const priority = watch('priority')

  const getPriorityColor = (value: string) => {
    switch (value) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getPriorityBg = (value: string) => {
    switch (value) {
      case 'low':
        return 'bg-green-50'
      case 'medium':
        return 'bg-yellow-50'
      case 'high':
        return 'bg-red-50'
      default:
        return 'bg-gray-50'
    }
  }

  const onSubmit = (data: unknown) => {
    console.log('Ticket saved:', data)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back</span>
        </button>
        <h3 className="font-semibold text-gray-900">Ticket Details</h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto px-6 py-4">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Assignee</label>
            <select
              {...register('assignee')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>Jane Doe</option>
              <option>John Smith</option>
              <option>Sarah Wilson</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Team</label>
            <select
              {...register('team')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>Customer Service</option>
              <option>Finance</option>
              <option>Technical Support</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
              <option>Closed</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Priority</label>
            <div className="flex gap-2">
              {[
                { value: 'low', label: 'Low', color: 'green' },
                { value: 'medium', label: 'Medium', color: 'yellow' },
                { value: 'high', label: 'High', color: 'red' },
              ].map((opt) => (
                <label key={opt.value} className="flex items-center">
                  <input
                    type="radio"
                    value={opt.value}
                    {...register('priority')}
                    className="w-4 h-4 text-teal-500 cursor-pointer"
                  />
                  <span className={`ml-2 text-sm font-medium ${getPriorityColor(opt.value)}`}>
                    ● {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Subject</label>
            <input
              {...register('subject')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Note</label>
            <textarea
              {...register('note')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </form>

      <div className="px-6 py-4 border-t border-gray-200 flex gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-teal-500 hover:bg-teal-600 text-white">
          Save Ticket
        </Button>
      </div>
    </div>
  )
}
