import { ReactNode, createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  type: 'single' | 'multiple';
}

const AccordionContext = createContext<AccordionContextValue | undefined>(undefined);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within an Accordion component');
  }
  return context;
}

interface AccordionProps {
  children: ReactNode;
  className?: string;
  type?: 'single' | 'multiple';
  defaultValue?: string | string[];
}

interface AccordionItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

interface AccordionTriggerProps {
  children: ReactNode;
  className?: string;
}

interface AccordionContentProps {
  children: ReactNode;
  className?: string;
}

export function Accordion({
  children,
  className = '',
  type = 'single',
  defaultValue
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (!defaultValue) return new Set();
    if (Array.isArray(defaultValue)) return new Set(defaultValue);
    return new Set([defaultValue]);
  });

  const toggleItem = (value: string) => {
    setOpenItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        if (type === 'single') {
          newSet.clear();
        }
        newSet.add(value);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={`space-y-2 ${className}`}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

const AccordionItemContext = createContext<string | undefined>(undefined);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within an AccordionItem');
  }
  return context;
}

export function AccordionItem({ value, children, className = '' }: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({ children, className = '' }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordionContext();
  const value = useAccordionItemContext();
  const isOpen = openItems.has(value);

  return (
    <button
      type="button"
      onClick={() => toggleItem(value)}
      className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors hover:bg-muted/50 ${className}`}
    >
      <span>{children}</span>
      <ChevronDown
        className={`h-5 w-5 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`}
      />
    </button>
  );
}

export function AccordionContent({ children, className = '' }: AccordionContentProps) {
  const { openItems } = useAccordionContext();
  const value = useAccordionItemContext();
  const isOpen = openItems.has(value);

  if (!isOpen) return null;

  return (
    <div className={`px-4 pb-4 pt-0 ${className}`}>
      {children}
    </div>
  );
}
