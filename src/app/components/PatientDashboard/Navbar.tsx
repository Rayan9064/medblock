import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";

const PatientNavbar = () => {
    const { connected, publicKey } = useWallet();
    const navigate = useNavigate();

    if (!connected) {
        navigate("/");
        return null;
      }

    return (
        <nav className="border-b bg-white/50 backdrop-blur-lg">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <span className="text-xl font-bold text-medical-600">
                            Patient Dashboard
                        </span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="medical-card px-4 py-2">
                            <p className="text-sm text-gray-500">Connected Wallet</p>
                            <p className="text-sm font-medium text-gray-900">
                                {publicKey?.toBase58().slice(0, 4)}...
                                {publicKey?.toBase58().slice(-4)}
                            </p>
                        </div>
                        <WalletMultiButton className="btn-primary" />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default PatientNavbar;