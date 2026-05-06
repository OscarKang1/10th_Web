import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import LpDetailPage from './pages/LpDetailPage';
import MyPage from './pages/MyPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 레이아웃 적용 라우트 */}
            <Route element={<Layout><HomePage /></Layout>} path="/" />
            <Route
              path="/lp/:lpId"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LpDetailPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 마이페이지 (보호 라우트) */}
            <Route
              path="/my"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MyPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* 레이아웃 없는 라우트 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
