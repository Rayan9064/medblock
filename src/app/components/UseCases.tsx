import { HoverEffect } from "@/components/ui/hover-effect"

export function UseCases() {
  return (
    <div className="w-full mx-auto px-8 bg-purple-950/10 dark:bg-purple-800/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <h2 className="text-4xl tracking-tighter font-geist bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 text-center pt-2">
                Use Cases
            </h2>
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
    {
        title: "For Patients",
        description:
            "Never lose access to medical history.",
        link: "#",
        idx: 0,
    },
    {
        title: "For Doctors",
        description:
            "Instant, secure patient history access.",
        link: "#",
        idx: 1,
    },
    {
        title: "For Hospitals",
        description:
            "Tamper-proof medical data storage.",
        link: "#",
        idx: 2,
    },
    {
        title: "For Researchers",
        description:
            "Verify medical records without intermediaries.",
        link: "#",
        idx: 3,
    },
];
