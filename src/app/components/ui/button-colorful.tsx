import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
// import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonColorful({
    className,
    label = "I am a Doctor",
    ...props
}: ButtonColorfulProps) {
    return (
        <Button
            className={cn(
                "relative h-auto py-4 px-4 overflow-hidden rounded-full", // Changed h-10 to h-auto, added py-2.5 and rounded-full
                "bg-zinc-900 dark:bg-zinc-100",
                "transition-all duration-200",
                "group",
                className
            )}
            {...props}
        >
            {/* Gradient background effect */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
                    "opacity-40 group-hover:opacity-80",
                    "blur transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div 
                className="relative flex items-center justify-center gap-2"
                onClick={() => window.location.href = '/doctor'}
            >
                <span className="text-white dark:text-zinc-900">{label}</span>
                {/* <ArrowUpRight className="w-3.5 h-3.5 text-white/90 dark:text-zinc-900/90" /> */}
            </div>
        </Button>
    );
}