import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Eye, EyeOff, HeartPulse, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { STATIC_USERS } from "@/lib/auth-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = location.state?.from?.pathname || "/"

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || "Login gagal. Silakan coba lagi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fillDemo = (user) => {
    setEmail(user.email)
    setPassword(user.password)
    setError("")
  }

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden flex-1 flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="text-lg font-semibold">FisioBook</p>
            <p className="text-sm text-primary-foreground/70">Admin Dashboard</p>
          </div>
        </div>

        <div className="max-w-md space-y-4">
          <h1 className="text-3xl font-bold leading-tight">
            Kelola layanan fisioterapi on-demand dengan mudah
          </h1>
          <p className="text-primary-foreground/80">
            Pantau booking, terapis, pasien, pembayaran, dan laporan dalam satu
            dashboard terpusat.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/60">
          © 2026 FisioBook. All rights reserved.
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold">FisioBook</p>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>

          <Card className="border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Masuk</CardTitle>
              <CardDescription>
                Masukkan email dan password untuk mengakses dashboard admin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@fisiobook.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    "Masuk"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-dashed shadow-none">
            <CardContent className="space-y-3 p-4">
              <p className="text-sm font-medium">Akun demo</p>
              <p className="text-xs text-muted-foreground">
                Klik salah satu akun di bawah untuk mengisi form secara otomatis.
              </p>
              <div className="space-y-2">
                {STATIC_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => fillDemo(user)}
                    className="flex w-full items-center justify-between rounded-lg border bg-muted/40 px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{user.role}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
