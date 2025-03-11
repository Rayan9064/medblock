"use client";
import React from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Navbar() {
  return (
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
              <WalletMultiButton className="btn-primary" />
          </div>
        </div>
      </nav>
  )
}
