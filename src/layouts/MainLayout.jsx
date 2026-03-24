import { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { TooltipProvider } from '../components/ui/tooltip';

export default function MainLayout({ children, active, setActive }) {
  const [isOpen, setIsOpen] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const prevActive = useRef(active);

  useEffect(() => {
    if (prevActive.current !== active) {
      setAnimKey(k => k + 1);
      prevActive.current = active;
    }
  }, [active]);

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-muted/40 overflow-hidden">
        <Sidebar
          active={active}
          setActive={setActive}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header active={active} setIsOpen={setIsOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            <div key={animKey} className="animate-page-enter">
              {children}
            </div>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
