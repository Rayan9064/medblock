import {
    Stepper,
    StepperDescription,
    StepperIndicator,
    StepperItem,
    StepperSeparator,
    StepperTitle,
    StepperTrigger,
  } from "@/components/ui/stepper";
  
  const steps = [
    {
      step: 1,
      title: "Upload Medical Report", 
      description: "Securely store documents on decentralized storage (IPFS/Arweave)",
    },
    {
      step: 2,
      title: "Mint NFT Record",
      description: "Create a blockchain-backed NFT containing medical metadata",
    },
    {
      step: 3,
      title: "Access & Share Securely",
      description: "Only authorized users can view the record",
    },
    {
      step: 4,
      title: "Verify Authenticity",
      description: "Check ownership and authenticity via the blockchain",
    },
  ];
  
  function Education() {
    return (
    <div className="space-y-8 text-center min-w-[350px] w-full mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16 relative bg-purple-950/10 dark:bg-purple-950/10 bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_20%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
        <h2 className="text-4xl tracking-tighter font-geist bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500">
            How it works?
        </h2>
        <Stepper defaultValue={2}>
          {steps.map(({ step, title, description }) => (
            <StepperItem key={step} step={step} className="relative flex-1 !flex-col">
              <StepperTrigger className="flex-col gap-3">
                <StepperIndicator />
                <div className="space-y-0.5 px-2">
                  <StepperTitle className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200">{title}</StepperTitle>
                  <StepperDescription className="max-sm:hidden">{description}</StepperDescription>
                </div>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="absolute inset-x-0 left-[calc(50%+0.75rem+0.125rem)] top-3 -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>
    );
  }
  
  export { Education };
  
//   <div className="space-y-8 text-center min-w-[350px]">
//       <h2 className="text-4xl tracking-tighter font-geist bg-clip-text text-transparent bg-[linear-gradient(180deg,_#000_0%,_rgba(0,_0,_0,_0.75)_100%)] dark:bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)]">
//         How it works?
//       </h2>
//       <Stepper defaultValue={2}>
//         {steps.map(({ step, title, description }) => (
//         <StepperItem key={step} step={step} className="relative flex-1 !flex-col">
//           <StepperTrigger className="flex-col gap-3">
//             <StepperIndicator />
//             <div className="space-y-0.5 px-2">
//             <StepperTitle className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200"></StepperTitle>
//               {title}
//             </StepperTitle>
//             <StepperDescription className="max-sm:hidden">{description}</StepperDescription>
//             </div>
//           </StepperTrigger>
//           {step < steps.length && (
//             <StepperSeparator className="absolute inset-x-0 left-[calc(50%+0.75rem+0.125rem)] top-3 -order-1 m-0 -translate-y-1/2 group-data-[orientation=horizontal]/stepper:w-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=horizontal]/stepper:flex-none" />
//           )}
//         </StepperItem>
//         ))}
//       </Stepper>
//       <p className="mt-2 text-xs text-muted-foreground" role="region" aria-live="polite">
//         Stepper with titles and descriptions
//       </p>
//     </div>