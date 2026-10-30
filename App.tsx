import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { PaymentModal } from './components/PaymentModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AllToolsPage } from './pages/AllToolsPage';
import { CompressorPage } from './pages/tools/CompressorPage';
import { ResizerPage } from './pages/tools/ResizerPage';
import { CropperPage } from './pages/tools/CropperPage';
import { ConverterPage } from './pages/tools/ConverterPage';
import { RotatorFlipperPage } from './pages/tools/RotatorFlipperPage';
import { ImageToPdfPage } from './pages/tools/ImageToPdfPage';
import { WatermarkPage } from './pages/tools/WatermarkPage';
import { FiltersPage } from './pages/tools/FiltersPage';
import { AiEditingPage } from './pages/tools/AiEditingPage';
import { PricingPage } from './pages/PricingPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AuthPages } from './pages/AuthPages';
import { StaticPages } from './pages/StaticPages';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '').trim();
    return hash || 'home';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('pixora_theme') === 'dark';
    } catch (_) {
      return false;
    }
  });

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pixora_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pixora_theme', 'light');
    }
  }, [darkMode]);

  // Sync route with hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash) {
        setCurrentRoute(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage navigate={navigate} openPaymentModal={() => setPaymentModalOpen(true)} />;
      case 'all-tools':
        return <AllToolsPage navigate={navigate} />;

      // Basic Tools
      case 'image-compressor':
        return <CompressorPage navigate={navigate} />;
      case 'image-resizer':
        return <ResizerPage navigate={navigate} />;
      case 'image-cropper':
        return <CropperPage navigate={navigate} />;

      // Converters
      case 'image-converter':
      case 'jpg-to-png':
      case 'png-to-jpg':
      case 'png-to-webp':
      case 'webp-to-jpg':
        return <ConverterPage navigate={navigate} presetRoute={currentRoute as any} />;

      // Rotator & Flipper
      case 'image-rotator':
        return <RotatorFlipperPage navigate={navigate} mode="rotator" />;
      case 'image-flipper':
        return <RotatorFlipperPage navigate={navigate} mode="flipper" />;

      // PDF & Watermark
      case 'image-to-pdf':
        return <ImageToPdfPage navigate={navigate} />;
      case 'image-watermark':
        return <WatermarkPage navigate={navigate} />;

      // Filters
      case 'rounded-corners':
      case 'grayscale':
      case 'blur-image':
      case 'color-adjuster':
      case 'metadata-viewer':
        return <FiltersPage navigate={navigate} toolType={currentRoute as any} />;

      // AI Photo Editing Tools
      case 'ai-background-remover':
      case 'ai-image-upscaler':
      case 'ai-image-enhancer':
      case 'ai-object-remover':
      case 'ai-background-generator':
        return (
          <AiEditingPage
            navigate={navigate}
            openPaymentModal={() => setPaymentModalOpen(true)}
            mode={currentRoute as any}
          />
        );

      // SaaS & User Views
      case 'pricing':
        return (
          <PricingPage
            navigate={navigate}
            openPaymentModal={() => setPaymentModalOpen(true)}
          />
        );
      case 'dashboard':
      case 'generation-history':
        return (
          <UserDashboardPage
            navigate={navigate}
            openPaymentModal={() => setPaymentModalOpen(true)}
          />
        );
      case 'profile':
        return (
          <UserProfilePage
            navigate={navigate}
            openPaymentModal={() => setPaymentModalOpen(true)}
          />
        );
      case 'admin':
        return <AdminDashboardPage navigate={navigate} />;

      // Auth Views
      case 'login':
        return <AuthPages navigate={navigate} mode="login" />;
      case 'register':
        return <AuthPages navigate={navigate} mode="register" />;
      case 'forgot':
        return <AuthPages navigate={navigate} mode="forgot" />;

      // Static Pages
      case 'about':
      case 'contact':
      case 'privacy':
      case 'terms':
        return <StaticPages navigate={navigate} page={currentRoute as any} />;

      default:
        return <HomePage navigate={navigate} openPaymentModal={() => setPaymentModalOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar
        currentRoute={currentRoute}
        navigate={navigate}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        openPaymentModal={() => setPaymentModalOpen(true)}
      />

      <main className="flex-1">{renderContent()}</main>

      <Footer navigate={navigate} />

      {/* Global Payment Upgrade Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />
    </div>
  );
}
