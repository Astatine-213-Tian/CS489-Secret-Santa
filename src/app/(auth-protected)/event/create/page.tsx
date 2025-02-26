"use client"

import { useRouter } from "next/navigation"
import { z } from "zod"

import { createEvent } from "@/server/actions/event"
import { EventForm, formSchema } from "@/components/event-detail-form"

export default function CreateEventPage() {
  const router = useRouter()

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    // Create the event and navigate to the event management page
    const eventId = await createEvent(data)
    router.push(`/event/${eventId}`)
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Create New Event</h1>
      </div>
      <EventForm handleSubmit={handleSubmit} submitButtonText="Create Event" />
    </main>
  )
}
