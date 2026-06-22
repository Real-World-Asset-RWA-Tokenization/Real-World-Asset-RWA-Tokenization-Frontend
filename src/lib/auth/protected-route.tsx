import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, type Role } from './auth-context'

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
          <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
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
