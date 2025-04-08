import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/router";

const DoctorNavbar = () => {
    const { connected, publicKey } = useWallet();
    const router = useRouter();
    
    if (!connected) {
      router.push("/");
      return null;
    }
      
    return (
      <nav className="sticky top-0 z-50 border-b border-white/20 dark:border-gray-800/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200">
                Doctor Dashboard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/20 dark:border-gray-800/20 px-4 py-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">Connected Wallet</p>
                <p className="text-sm font-medium">
                  {publicKey?.toBase58().slice(0, 4)}...
                  {publicKey?.toBase58().slice(-4)}
                </p>
              </div>
              <WalletMultiButton className="!bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-300 dark:to-orange-200 !text-white border-0" />
            </div>
          </div>
        </div>
      </nav>
    );
};

export default DoctorNavbar;