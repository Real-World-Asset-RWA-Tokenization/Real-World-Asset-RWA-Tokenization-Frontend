import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, type Role } from './auth-context'
import { Spinner } from '@/components/ui/spinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  roles?: Role[]
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="text-blue-600" size={32} />
          <p className="text-sm text-slate-500">Connecting wallet...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (roles && !roles.includes(session.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-lg font-medium text-slate-900">Access Denied</p>
        <p className="text-sm text-slate-500 mt-1">You do not have permission to view this page.</p>
      </div>
    )
  }

  return <>{children}</>
}
