import { useNavigate } from "react-router-dom"
import { CheckCircle, Clock, Eye, Pencil, Star, Users } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { therapists } from "@/lib/therapists-data"

const stats = [
  { title: "Total Therapists", value: "48", description: "42 active, 6 inactive", icon: Users },
  { title: "Available Today", value: "32", description: "67% availability rate", icon: CheckCircle },
  { title: "Avg. Rating", value: "4.8", description: "Based on 1,240 reviews", icon: Star },
  { title: "Pending Verification", value: "5", description: "Awaiting document review", icon: Clock },
]

export default function TherapistsPage() {
  const navigate = useNavigate()

  const goToDetail = (id) => navigate(`/users/therapists/${id}`)

  const columns = [
    {
      key: "name",
      label: "Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-xs text-primary">
              {row.name.split(" ").slice(1).map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    {
      key: "registeredAt",
      label: "Registered At",
      render: (row) => row.registeredAt || row.joinedAt || "-",
    },
    { key: "status", label: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={() => goToDetail(row.id)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
            onClick={() => goToDetail(row.id)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <PageLayout
      title="Therapist Management"
      stats={stats}
      searchPlaceholder="Filter therapists..."
      statusFilters={["Inactive", "Active", "In Review", "Rejected"]}
      columns={columns}
      data={therapists}
      onRowClick={(row) => goToDetail(row.id)}
      showDatePicker={false}
    />
  )
}
