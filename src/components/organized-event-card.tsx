import Link from "next/link"
import { format } from "date-fns"
import { CalendarClock, DollarSign, MapPin } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "./ui/button-variants"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface OrganizedEventCardProps {
  name: string
  eventId: string
  eventDate: Date
  location: string
  drawCompleted: boolean
  budget: number
}

export const OrganizedEventCard = ({
  name,
  eventId,
  eventDate,
  location,
  drawCompleted,
  budget,
}: OrganizedEventCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3 pt-5">
        <CardTitle className="text-lg mb-2">{name}</CardTitle>
        <p className="text-base font-medium text-gray-600">
          {format(eventDate, "LLL dd, y")}
        </p>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between pt-0">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 flex items-center">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            Location:&nbsp;
            <span className="font-medium line-clamp-1">{location}</span>
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <CalendarClock className="w-4 h-4 mr-1 flex-shrink-0" />
            Draw Status:&nbsp;
            <span className="font-medium">
              {drawCompleted ? "Completed" : "Pending"}
            </span>
          </p>
          <p className="text-sm text-gray-600 flex items-center">
            <DollarSign className="w-4 h-4 mr-1 flex-shrink-0" />
            Budget:&nbsp;
            <span className="font-medium">{budget}</span>
          </p>
        </div>
        <Link
          href={`/dashboard/events/${eventId}`}
          className={cn(buttonVariants({ variant: "default" }), "mt-4")}
        >
          Manage
        </Link>
      </CardContent>
    </Card>
  )
}
