"use server"

import { eq } from "drizzle-orm"
import { z } from "zod"

import { getUserInfo } from "@/lib/auth/auth-server"
import { userProfileSchema } from "@/schemas/profile"
import { db } from "../db"
import { user } from "../db/schema"

export async function updateProfile(
  profile: z.infer<typeof userProfileSchema>
) {
  try {
    userProfileSchema.parse(profile)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.message }
    }
    throw error
  }
  const { id: userId } = await getUserInfo()
  const { name, bio, giftPreferences } = profile
  await db
    .update(user)
    .set({ name, bio, giftPreferences })
    .where(eq(user.id, userId))
}
