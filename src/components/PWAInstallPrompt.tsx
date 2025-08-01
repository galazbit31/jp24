import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useLanguage } from '@/hooks/useLanguage';

const PWAInstallPrompt = () => {
  const { 
    isInstallable, 
    isIOSDevice, 
    isStandalone,
    handleInstallClick 
  } = usePWAInstall();
  
  const [dismissed, setDismissed] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { t } = useLanguage();
  
  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed') === 'true';
    if (hasDismissed) {
      setDismissed(true);
      return;
    }
    
    // Only show the prompt after 5 seconds if the app is installable and not already installed
    if ((isInstallable || isIOSDevice) && !isStandalone && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isIOSDevice, isStandalone, dismissed]);
  
  const handleDismiss = () => {
    setDismissed(true);
    setShowPrompt(false);
    // Save dismissal to localStorage
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };
  
  if (!showPrompt || isStandalone || (!isInstallable && !isIOSDevice) || dismissed) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-40 animate-fade-in">
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>
      
      <div className="flex items-center">
        <div className="mr-4 flex-shrink-0">
          <img 
            src="/logo.png" 
            alt="Injapan Food Logo" 
            className="w-12 h-12 rounded-full object-contain bg-white p-1"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900">{t('pwa.installApp')}</h3>
          <p className="text-sm text-gray-600">
            {isIOSDevice 
              ? t('pwa.addToHomeScreen') 
              : t('pwa.installForBetterExperience')}
          </p>
        </div>
        <Button 
          onClick={handleInstallClick}
          className="bg-primary hover:bg-primary/90 text-white ml-4"
        >
          <Download className="w-4 h-4 mr-2" />
          {t('pwa.install')}
        </Button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;