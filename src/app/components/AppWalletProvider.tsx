"use client";

import React, { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
// import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
// import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

// imports here

export default function AppWalletProvider({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
    const wallets = useMemo(
      () => [
        // manually add any legacy wallet adapters here
        // new UnsafeBurnerWalletAdapter(),
        new PhantomWalletAdapter(), new SolflareWalletAdapter()
      ],
      [],
    );
  
    return (
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>{children}</WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    );
  }