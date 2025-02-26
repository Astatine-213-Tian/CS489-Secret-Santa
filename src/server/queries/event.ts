import "server-only"

import { and, count, desc, eq, gte, sql } from "drizzle-orm"

import { getUserId } from "@/lib/auth/auth-server"
import { db } from "@/server/db"
import {
  event,
  eventParticipant,
  EventSchema,
  santaPair,
  user,
} from "@/server/db/schema"

export async function getOrganizedEvents() {
  const userId = await getUserId()

  const events = await db
    .select({
      eventId: event.id,
      name: event.name,
      eventDate: event.eventDate,
      drawDate: event.drawDate,
      location: event.location,
      participantsNum: count(eventParticipant.userId),
    })
    .from(event)
    .where(and(eq(event.organizerId, userId), gte(event.eventDate, new Date())))
    .leftJoin(eventParticipant, eq(event.id, eventParticipant.eventId))
    .groupBy(event.id)
    .orderBy(desc(event.eventDate))

  return events
}

export async function getJoinedEvents() {
  const userId = await getUserId()

  const events = await db
    .select({
      eventId: event.id,
      name: event.name,
      eventDate: event.eventDate,
      location: event.location,
      budget: event.budget,
      secretFriend: sql<string>`COALESCE(${user.name}, 'Pending')`,
    })
    .from(eventParticipant)
    .where(eq(eventParticipant.userId, userId))
    .innerJoin(
      event,
      and(
        eq(eventParticipant.eventId, event.id),
        gte(event.eventDate, new Date())
      )
    )
    .leftJoin(
      santaPair,
      and(eq(event.id, santaPair.eventId), eq(santaPair.giverId, userId))
    )
    .leftJoin(user, eq(santaPair.receiverId, user.id))
    .orderBy(desc(event.eventDate))

  return events
}

// TODO: should we have seperate queries for the organizer and the participant?
export async function getEvent(eventId: string): Promise<{
  details: EventSchema
  isOrganizer: boolean
}> {
  // Get the specific event
  const events = await db
    .select() // select all columns
    .from(event)
    .where(eq(event.id, eventId)) // only want ONE specific event

  if (events.length !== 1) {
    throw new Error(
      `Expected exactly one event, but got ${events.length} when searching for event with id ${eventId}`
    )
  }

  const details = events[0]

  if (!details) {
    throw new Error("Event not found or you are not the organizer")
  }

  const isOrganizer = details.organizerId === (await getUserId())

  return { details, isOrganizer }
}
