import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminPortal from './pages/AdminPortal';
import CustomerDashboardWrapper from './pages/CustomerDashboardWrapper';
import { ImpersonationBanner } from './components/ui/ImpersonationBanner';

function App() {
    return (
        <AuthProvider>
            <MainApp />
        </AuthProvider>
    );
}

function MainApp() {
    const { user, isAdmin, isImpersonating, loading } = useAuth();

    if (loading) {
        return <div className="h-screen w-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
    }

    if (!user) {
        return <LoginPage />;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
            {isImpersonating && <ImpersonationBanner />}
            {isAdmin && !isImpersonating ? <AdminPortal /> : <CustomerDashboardWrapper />}
        </div>
    );
}

export default App;
