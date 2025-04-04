"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function Features() {
    return (
        <div className=" bg-purple-950/10 pb-4 dark:bg-purple-800/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
            <h2 className="text-4xl tracking-tighter font-geist bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-center py-8">
                Key Features
            </h2>
            <ul className="grid grid-cols-1 w-full grid-rows-none gap-2 md:grid-cols-12 md:grid-rows-2 lg:gap-3 xl:grid-rows-2 lg:mx-auto">
                <GridItem
                    area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                    icon={<Box className="h-4 w-4 text-purple-500" />}
                    title="Full Privacy & Security"
                    description="Only authorized access via blockchain."
                />
                <GridItem
                    area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                    icon={<Settings className="h-4 w-4 text-purple-500" />}
                    title="Patient-Controlled Access"
                    description="Share reports only with doctors or hospitals."
                />
                <GridItem
                    area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                    icon={<Lock className="h-4 w-4 text-purple-500" />}
                    title="Permanent & Tamper-Proof"
                    description="Stored on decentralized storage (IPFS/Arweave)."
                />
                <GridItem
                    area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                    icon={<Sparkles className="h-4 w-4 text-purple-500" />}
                    title="Blockchain Verification"
                    description="Ensures authenticity & prevents fraud."
                />
                <GridItem
                    area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                    icon={<Search className="h-4 w-4 text-purple-500" />}
                    title="Accessible Anytime, Anywhere"
                    description="No dependency on centralized systems."
                />
            </ul>
        </div>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={cn("min-h-[14rem] list-none", area)}>
            <div className="relative h-[95%] rounded-[1.25rem] border-[0.75px] border-border p-2 mx-2 md:rounded-[1.5rem] md:p-3">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                <div className="relative flex h-full flex-col justify-between gap-4 overflow-hidden rounded-xl border-[0.75px] bg-background py-3 shadow-sm dark:shadow-[0px_0px_27px_0px_rgba(45,45,45,0.3)] md:px-5 md:py-6">
                    <div className="relative flex flex-1 flex-col justify-around gap-2">
                        <div className="w-fit rounded-lg border-[0.75px] border-border bg-muted p-2">
                            {icon}
                        </div>
                        <div className="space-y-1">
                            <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold font-sans tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-balance bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 bg-clip-text text-transparent">
                                {title}
                            </h3>
                            <h2 className="[&_b]:md:font-semibold [&_strong]:md:font-semibold font-sans text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-muted-foreground">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
