import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import PlannerLayout from './components/planner/PlannerLayout';
import MonthlyView from './pages/MonthlyView';
import WeeklyView from './pages/WeeklyView';
import DailyDetail from './pages/DailyDetail';
import LoginPage from './pages/LoginPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route element={<PlannerLayout />}>
        <Route path="/" element={<MonthlyView />} />
        <Route path="/weekly" element={<WeeklyView />} />
      </Route>
      <Route path="/day/:date" element={<DailyDetail />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router basename="/digital-planner">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/*" element={<AuthenticatedApp />} />
          </Routes>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
