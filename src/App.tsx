import React, { useState } from 'react';
import { PhotographerProvider } from './context/PhotographerContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { PortfolioGallery } from './components/PortfolioGallery';
import { PricingSection } from './components/PricingSection';
import { ReviewsSection } from './components/ReviewsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { QuickContactWidget } from './components/QuickContactWidget';
import { AdminModal } from './components/AdminModal';
import { ToastContainer } from './components/Toast';

export function PhotographerApp() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [preselectedPackageId, setPreselectedPackageId] = useState<string | undefined>();
  const [prefilledNote, setPrefilledNote] = useState<string | undefined>();

  const scrollToContact = (packageId?: string, note?: string) => {
    if (packageId) setPreselectedPackageId(packageId);
    if (note) setPrefilledNote(note);

    const contactElem = document.getElementById('contacts');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black font-sans">
      {/* Toast Notifications */}
      <ToastContainer />

      {/* Clean Top Navigation Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={() => scrollToContact()}
      />

      <main className="flex-1">
        {/* Hero Section */}
        <Hero onOpenBooking={() => scrollToContact()} />

        {/* 01. About & Philosophy */}
        <AboutSection onOpenAdmin={() => setIsAdminOpen(true)} />

        {/* 02. Portfolio Gallery with Lightbox */}
        <PortfolioGallery
          onOpenAdmin={() => setIsAdminOpen(true)}
          onBookShoot={(title) => scrollToContact(undefined, title)}
        />

        {/* 03. Pricing & Service Packages */}
        <PricingSection
          onSelectPackage={(pkgId) => scrollToContact(pkgId)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 04. Client Reviews & Testimonials */}
        <ReviewsSection />

        {/* 05. Contact Window & Booking Form */}
        <ContactSection
          preselectedPackageId={preselectedPackageId}
          prefilledNote={prefilledNote}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenBooking={() => scrollToContact()}
      />

      {/* Floating Speed Dial for Messengers */}
      <QuickContactWidget onOpenBooking={() => scrollToContact()} />

      {/* Admin Panel Modal for Photographer Friend */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PhotographerProvider>
      <PhotographerApp />
    </PhotographerProvider>
  );
}
