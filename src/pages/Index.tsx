
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";

const Index = () => {
  const { connected, connecting } = useWallet();
  const navigate = useNavigate();

  const handleRoleSelect = (role: "patient" | "doctor") => {
    if (!connected) {
      toast({
        title: "Please connect your wallet",
        description: "You need to connect your wallet first",
        variant: "destructive",
      });
      return;
    }
    navigate(`/${role}`);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-medical-50 to-white">
      {/* Navigation */}
      <nav className="relative z-10 border-b bg-white/50 backdrop-blur-lg">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="text-xl font-bold text-medical-600">MediChain</div>
              <div className="hidden md:flex md:space-x-6">
                <a href="#" className="nav-link">Home</a>
                <a href="#" className="nav-link">About</a>
                <a href="#" className="nav-link">Contact</a>
              </div>
            </div>
            <WalletModalProvider>
              <WalletMultiButton className="btn-primary" />
            </WalletModalProvider>
          </div>
        </div>
      </nav>

      <div className="relative container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center justify-center space-y-12"
        >
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl"
            >
              <span className="block">Decentralized Medical</span>
              <span className="block text-medical-600">Report Tracking</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl"
            >
              Secure, transparent, and efficient medical record management using
              blockchain technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0"
            >
              <Button
                onClick={() => handleRoleSelect("patient")}
                className="btn-primary"
              >
                I'm a Patient
              </Button>
              <Button
                onClick={() => handleRoleSelect("doctor")}
                variant="outline"
                className="border-medical-600 text-medical-600 hover:bg-medical-50"
              >
                I'm a Doctor
              </Button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Secure Storage",
                description:
                  "Your medical reports are encrypted and stored securely on the blockchain.",
                icon: (
                  <svg
                    className="h-6 w-6 text-medical-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
              },
              {
                title: "Easy Sharing",
                description:
                  "Share your medical reports with healthcare providers instantly.",
                icon: (
                  <svg
                    className="h-6 w-6 text-medical-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                    />
                  </svg>
                ),
              },
              {
                title: "Full Control",
                description:
                  "Maintain complete control over who can access your medical data.",
                icon: (
                  <svg
                    className="h-6 w-6 text-medical-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.2, duration: 0.8 }}
                className="medical-card"
              >
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-medical-100 p-3">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="relative border-t bg-white/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-between">
            <div className="mb-4 w-full md:mb-0 md:w-auto">
              <div className="text-sm text-gray-500">
                © 2024 MediChain. All rights reserved.
              </div>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-medical-600">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-medical-600">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-medical-600">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
