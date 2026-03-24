import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { TooltipProvider } from '../components/ui/tooltip';

export default function MainLayout({ children, active, setActive }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-muted/30 overflow-hidden">
        <Sidebar
          active={active}
          setActive={setActive}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header active={active} setIsOpen={setIsOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
