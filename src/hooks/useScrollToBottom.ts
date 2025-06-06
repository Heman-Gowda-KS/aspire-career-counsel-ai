
import { useRef, useEffect, useState } from 'react';

export const useScrollToBottom = () => {
  const [autoScroll, setAutoScroll] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // Get viewport reference
  useEffect(() => {
    if (scrollAreaRef.current) {
      setTimeout(() => {
        const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          viewportRef.current = viewport as HTMLDivElement;
          // Initial scroll to bottom
          scrollToBottom(true);
        }
      }, 200); // Small delay to ensure DOM is ready
    }
  }, []);

  // Handle scrolling to bottom
  const scrollToBottom = (force = false) => {
    if (viewportRef.current && (autoScroll || force)) {
      viewportRef.current.scrollTo({
        top: viewportRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Detect scroll events to manage auto-scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!viewportRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = viewportRef.current;
      // If scrolled up more than 100px, disable auto-scroll
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setAutoScroll(isNearBottom);
    };
    
    const currentViewport = viewportRef.current;
    if (currentViewport) {
      currentViewport.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (currentViewport) {
        currentViewport.removeEventListener('scroll', handleScroll);
      }
    };
  }, [viewportRef.current]); // This ensures we re-attach if viewportRef changes

  return {
    scrollAreaRef,
    messagesEndRef,
    viewportRef,
    autoScroll,
    setAutoScroll,
    scrollToBottom
  };
};
