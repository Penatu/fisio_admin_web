import { useNavigate } from "react-router-dom"
import { Calendar, Eye, HeartPulse, Pencil, UserCheck, Users } from "lucide-react"
import { PageLayout } from "@/components/layout/page-layout"
import { StatusBadge } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { patients } from "@/lib/patients-data"

const stats = [
  { title: "Total Patients", value: "3,562", description: "+234 new this month", icon: Users },
  { title: "Active Patients", value: "2,890", description: "81% retention rate", icon: UserCheck },
  { title: "Total Sessions", value: "12,450", description: "Avg. 3.5 per patient", icon: Calendar },
  { title: "Chronic Cases", value: "428", description: "Requiring ongoing care", icon: HeartPulse },
]

export default function PatientsPage() {
  const navigate = useNavigate()

  const goToDetail = (id) => navigate(`/users/patients/${id}`)

  const columns = [
    {
      key: "name",
      label: "Patient",
      render: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-50 text-xs text-blue-600">
              {row.name.split(" ").map((n) => n[0]).join("")}
            </AvatarFallback>
          </Avatar>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "age", label: "Age" },
    { key: "condition", label: "Condition" },
    { key: "sessions", label: "Sessions" },
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
      title="Patient Management"
      stats={stats}
      searchPlaceholder="Filter patients..."
      statusFilters={["Active", "Inactive"]}
      columns={columns}
      data={patients}
      onRowClick={(row) => goToDetail(row.id)}
      showDatePicker={false}
    />
  )
}
