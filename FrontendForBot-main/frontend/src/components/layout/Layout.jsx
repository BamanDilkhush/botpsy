import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    // removed overflow-hidden so page content (descenders, shadows) won't get clipped
    <div className="relative min-h-screen flex flex-col bg-background font-sans text-text">
      {/* Floating Backdrop Blobs (behind everything) */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div
          className="absolute -left-20 top-16 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"
          style={{ backgroundColor: 'rgba(37,99,235,0.15)' }}
        />
        <div
          className="absolute right-0 top-28 w-[28rem] h-[28rem] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"
          style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}
        />
        <div
          className="absolute left-1/3 bottom-0 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"
          style={{ backgroundColor: 'rgba(99,102,241,0.12)' }}
        />
      </div>

      <Navbar />
      {/* main kept as relative z-10 and overflow-visible to prevent clipping */}
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 overflow-visible">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
