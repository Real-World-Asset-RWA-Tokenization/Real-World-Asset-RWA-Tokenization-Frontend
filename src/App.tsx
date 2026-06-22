import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/components/theme/theme-provider'
import { AuthProvider } from '@/lib/auth/auth-context'
import { ProtectedRoute } from '@/lib/auth/protected-route'
import { ToastProvider } from '@/lib/errors/toast'
import { Layout } from '@/components/layout/layout'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { lazy, Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const queryClient = new QueryClient()

const Dashboard = lazy(() => import('@/pages/dashboard'))
const Assets = lazy(() => import('@/pages/assets'))
const AssetDetail = lazy(() => import('@/pages/asset-detail'))
const Investors = lazy(() => import('@/pages/investors'))
const InvestorDetail = lazy(() => import('@/pages/investor-detail'))
const Dividends = lazy(() => import('@/pages/dividends'))
const Compliance = lazy(() => import('@/pages/compliance'))
const Settings = lazy(() => import('@/pages/settings'))

function PageLoader() {
  return (
    <div className="space-y-6 p-4" aria-label="Loading page content">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
      </div>
      <Skeleton className="h-80 rounded-xl" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <ErrorBoundary>
              <Routes>
                <Route element={<Layout />}>
                  <Route
                    index
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <Dashboard />
                      </Suspense>
                    }
                  />
                  <Route
                    path="assets"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <Assets />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="assets/:id"
                    element={
                      <ProtectedRoute>
                        <Suspense fallback={<PageLoader />}>
                          <AssetDetail />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="investors"
                    element={
                      <ProtectedRoute roles={['issuer', 'admin']}>
                        <Suspense fallback={<PageLoader />}>
                          <Investors />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="investors/:id"
                    element={
                      <ProtectedRoute roles={['issuer', 'admin']}>
                        <Suspense fallback={<PageLoader />}>
                          <InvestorDetail />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="dividends"
                    element={
                      <ProtectedRoute roles={['issuer', 'admin']}>
                        <Suspense fallback={<PageLoader />}>
                          <Dividends />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="compliance"
                    element={
                      <ProtectedRoute roles={['issuer', 'admin']}>
                        <Suspense fallback={<PageLoader />}>
                          <Compliance />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <ProtectedRoute roles={['issuer', 'admin']}>
                        <Suspense fallback={<PageLoader />}>
                          <Settings />
                        </Suspense>
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </ErrorBoundary>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
