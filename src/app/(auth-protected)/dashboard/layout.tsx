import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-1 overflow-hidden">
      <DashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="container mx-auto px-4 sm:px-8 py-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  )
}
