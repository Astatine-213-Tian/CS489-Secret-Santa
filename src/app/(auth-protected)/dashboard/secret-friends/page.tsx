import {
  fetchUserGiftGivers,
  fetchUserGiftReceivers,
} from "@/server/queries/event"
import { AssignmentCard } from "@/components/assignment-card"

export default async function GiftsPage() {
  const receivers = await fetchUserGiftReceivers()
  const givers = await fetchUserGiftGivers()

  const receiversUi = receivers.map((r) => (
    <AssignmentCard key={r.event.id} event={r.event} assignee={r.receiver} />
  ))

  // giver might be null => secret
  const giversUi = givers.map((a) => (
    <AssignmentCard
      key={a.event.id}
      event={a.event}
      assignee={a.giver ?? "secret"}
    />
  ))

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-3">
        Secret Friends
      </h1>
      {!receivers || !givers ? (
        <div>You have no gift assignments yet. Try joining an event!</div>
      ) : (
        <>
          {/* PEOPLE YOUR ASSIGNED TO */}
          <h2 className="text-xl font-semibold text-gray-800">
            My Assignments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
            {receiversUi}
          </div>
          {/* PEOPLE ASSIGNED TO YOU */}
          <h2 className="text-xl font-semibold text-gray-800">
            My Gift Givers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8">
            {giversUi}
          </div>
        </>
      )}
    </div>
  )
}
