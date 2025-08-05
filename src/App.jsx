import React, { useState } from 'react';
import { Calculator, TrendingUp, PiggyBank, Menu, X, User } from 'lucide-react';
import { AuthProvider } from './components/auth/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import UserProfile from './components/auth/UserProfile';
import EMICalculator from './components/EMICalculator';
import BorrowingCapacity from './components/BorrowingCapacity';
import PrepaymentCalculator from './components/PrepaymentCalculator';
import AboutMe from './components/AboutMe';
import { getCopyrightText } from './utils/dateUtils';

function AppContent() {
  const [activeTab, setActiveTab] = useState('emi');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'emi', name: 'EMI Calculator', icon: Calculator },
    { id: 'capacity', name: 'Borrowing Capacity', icon: TrendingUp },
    { id: 'prepayment', name: 'Prepayment Benefits', icon: PiggyBank },
    { id: 'about', name: 'About Me', icon: User },
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'emi':
        return <EMICalculator />;
      case 'capacity':
        return <BorrowingCapacity />;
      case 'prepayment':
        return <PrepaymentCalculator />;
      case 'about':
        return <AboutMe />;
      default:
        return <EMICalculator />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary-700">LoanSathi</h1>
                <p className="text-xs text-gray-500">Smart Loan Calculator</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Profile & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <UserProfile />
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-primary-700 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderActiveComponent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              {getCopyrightText()}
            </p>
            <p className="text-gray-400 text-xs mt-2">
              All calculations are estimates. Please consult with your bank for exact figures.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}

export default App;
