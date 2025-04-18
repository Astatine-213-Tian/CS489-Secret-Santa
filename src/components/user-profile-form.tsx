"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { FileText, Gift, User } from "lucide-react"
import { useForm, useFormContext } from "react-hook-form"
import * as z from "zod"

import { updateProfile } from "@/server/actions/profile"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { userProfileSchema } from "@/schemas/profile"
import { Avatar } from "./ui/avatar"

// Infer the type from the schema
type ProfileFormValues = z.infer<typeof userProfileSchema>

function PersonalInfoCard({
  avatarUrl,
  email,
}: {
  avatarUrl: string | null
  email: string
}) {
  const form = useFormContext<ProfileFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal details and how others will see you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center mt-4">
            <Avatar src={avatarUrl} alt={form.getValues("name")} size={96} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input value={email} disabled />
              </FormItem>
            </div>
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Tell others a bit about yourself"
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GiftPreferencesCard() {
  const form = useFormContext<ProfileFormValues>()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gift Preferences</CardTitle>
        <CardDescription>
          Help your Secret Santa know what you'd like to receive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="likes">
          <TabsList className="mb-4">
            <TabsTrigger value="likes">
              <Gift className="h-4 w-4" />
              Likes & Dislikes
            </TabsTrigger>
            <TabsTrigger value="sizes">
              <User className="h-4 w-4" />
              Sizes & Allergies
            </TabsTrigger>
            <TabsTrigger value="additional">
              <FileText className="h-4 w-4" />
              Additional Info
            </TabsTrigger>
          </TabsList>
          <TabsContent value="likes" className="space-y-4">
            <FormField
              control={form.control}
              name="giftPreferences.likes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Things I Like</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="What kinds of gifts do you enjoy?"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="giftPreferences.dislikes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Things I Dislike</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="What should your Secret Santa avoid?"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="sizes" className="space-y-4">
            <FormField
              control={form.control}
              name="giftPreferences.sizes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clothing / Shoe Sizes</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="If applicable, what sizes do you wear?"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="giftPreferences.allergies"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allergies or Sensitivities</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Any allergies your Secret Santa should know about?"
                      rows={2}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="additional">
            <FormField
              control={form.control}
              name="giftPreferences.additionalInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Information</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Anything else your Secret Santa should know?"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

interface UserProfileFormProps extends ProfileFormValues {
  avatarUrl: string | null
  email: string
}

export function UserProfileForm({
  avatarUrl,
  email,
  ...initialValues
}: UserProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: initialValues,
  })

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true)

    try {
      await updateProfile(data)
      form.reset(data)
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <PersonalInfoCard avatarUrl={avatarUrl} email={email} />
        <GiftPreferencesCard />
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isDirty}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
