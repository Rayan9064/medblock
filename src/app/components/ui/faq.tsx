"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FaqSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string;
  description?: string;
  items: {
    question: string;
    answer: string;
  }[];
  contactInfo?: {
    title: string;
    description: string;
    buttonText: string;
    onContact?: () => void;
  };
}

const FaqSection = React.forwardRef<HTMLElement, FaqSectionProps>(
  ({ className, title, description, items, contactInfo, ...props }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          "py-16 w-full bg-purple-950/10 dark:bg-purple-800/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]",
          className
        )}
        {...props}
      >
        <div className="container mx-auto">
          {/* Header */}
          <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center mb-12"
          >
        <h2 className="text-4xl tracking-tighter font-geist bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-center pt-2">
          {title}
        </h2>
        {description && (
          <p className="text-sm text-zinc-400">{description}</p>
        )}
          </motion.div>

          {/* FAQ Items */}
          <div className="max-w-2xl mx-auto space-y-2">
        {items.map((item, index) => (
          <FaqItem
            key={index}
            question={item.question}
            answer={item.answer}
            index={index}
          />
        ))}
          </div>

          {/* Contact Section */}
          {contactInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="max-w-md mx-auto mt-12 p-6 rounded-lg text-center"
        >
          <div className="inline-flex items-center justify-center p-1.5 rounded-full mb-4">
            <Mail className="h-4 w-4 text-purple-500" />
          </div>
          <p className="text-sm font-bold tracking-tighter font-geist bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-center pt-2 mb-1">
            {contactInfo.title}
          </p>
          <p className="text-xs text-zinc-400 mb-4">
            {contactInfo.description}
          </p>
          <Button className=" bg-white dark:bg-black/[0.9] text-black dark:text-white" size="sm" onClick={contactInfo.onContact}>
            {contactInfo.buttonText}
          </Button>
        </motion.div>
          )}
        </div>
      </section>
    );
  }
);
FaqSection.displayName = "FaqSection";

// Internal FaqItem component
const FaqItem = React.forwardRef<
  HTMLDivElement,
  {
    question: string;
    answer: string;
    index: number;
  }
>((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { question, answer, index } = props;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.1 }}
      className={cn(
      "group rounded-lg",
      "transition-all duration-200 ease-in-out",
        "border border-border/50",
        isOpen
        ? "bg-white dark:bg-black/[0.9] bg-gradient-to-br from-purple-300/50 via-white to-pink-500/50 dark:from-purple-950/20 dark:via-black/90 dark:to-pink-950/20"
        : "bg-white hover:bg-muted/80 dark:bg-muted/30"
      )}
    >
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 h-auto justify-between hover:bg-transparent"
      >
        <h3
          className={cn(
            "text-lg tracking-tighter font-geist bg-clip-text text-transparent transition-colors duration-200 text-left",
            "text-zinc-500 dark:text-zinc-400",
            isOpen && "text-foreground"
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            "p-0.5 rounded-full flex-shrink-0",
            "transition-colors duration-200",
            isOpen ? "text-primary" : "text-muted-foreground"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </Button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: { duration: 0.2, ease: "easeOut" },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: { duration: 0.2, ease: "easeIn" },
            }}
          >
            <div className="px-6 pb-4 pt-2">
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                className="text-sm text-muted-foreground leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
FaqItem.displayName = "FaqItem";

export { FaqSection };