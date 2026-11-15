import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { GuestRoute } from "@/components/auth/guest-route"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import DashboardPage from "@/pages/dashboard"
import TherapistsPage from "@/pages/users/therapists"
import TherapistDetailPage from "@/pages/users/therapist-detail"
import PatientsPage from "@/pages/users/patients"
import PatientDetailPage from "@/pages/users/patient-detail"
import AdminsPage from "@/pages/users/admins"
import AdminDetailPage from "@/pages/users/admin-detail"
import ServicesPage from "@/pages/services"
import ServiceDetailPage from "@/pages/services/service-detail"
import BookingsPage from "@/pages/bookings"
import BookingDetailPage from "@/pages/bookings/booking-detail"
import PaymentsPage from "@/pages/payments"
import PaymentDetailPage from "@/pages/payments/payment-detail"
import ReportsPage from "@/pages/reports"
import RevenueReportPage from "@/pages/reports/revenue"
import OccupancyReportPage from "@/pages/reports/occupancy"
import PayrollReportPage from "@/pages/reports/payroll"
import PayrollDetailPage from "@/pages/reports/payroll-detail"
import ReportDetailPage from "@/pages/reports/report-detail"
import LoginPage from "@/pages/auth/login"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="users/therapists" element={<TherapistsPage />} />
            <Route path="users/therapists/:id" element={<TherapistDetailPage />} />
            <Route path="users/patients" element={<PatientsPage />} />
            <Route path="users/patients/:id" element={<PatientDetailPage />} />
            <Route path="users/admins" element={<AdminsPage />} />
            <Route path="users/admins/:id" element={<AdminDetailPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:id" element={<ServiceDetailPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="bookings/:id" element={<BookingDetailPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="payments/:id" element={<PaymentDetailPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="reports/revenue" element={<RevenueReportPage />} />
            <Route path="reports/occupancy" element={<OccupancyReportPage />} />
            <Route path="reports/payroll" element={<PayrollReportPage />} />
            <Route path="reports/payroll/:id" element={<PayrollDetailPage />} />
            <Route path="reports/:type/:id" element={<ReportDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
