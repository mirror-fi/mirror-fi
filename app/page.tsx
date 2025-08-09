"use client";

import { TermsOfService } from "@/components/TermsOfService";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import StrategyDashboardPage from "./strategy-dashboard/page";


type Props = {
  searchParams: { id?: string }
}


export default function Home({ searchParams }: Props) {
  const { connected, publicKey } = useWallet();
  const [hasSignedTerms, setHasSignedTerms] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkLocalSignature = async () => {
      if (!publicKey) {
        setChecking(false);
        return;
      }

      // Check local signature
      const storedSignatures = localStorage.getItem("termsSignatures") || "{}";
      const signatures = JSON.parse(storedSignatures);
      if (signatures[publicKey.toBase58()]) {
        setHasSignedTerms(true);
        setChecking(false);
        return;
      }

      // Check if user exists in DB
      try {
        const res = await fetch(`/api/get-user?publicAddress=${publicKey.toBase58()}`);
        if (res.ok) {
          const user = await res.json();
          if (user.likes !== undefined) {
            setHasSignedTerms(true);
          }
        }
      } catch {}
      setChecking(false);
    };

    checkLocalSignature();
  }, [publicKey]);

  const handleTermsSigned = async () => {
    setHasSignedTerms(true);
    if (publicKey) {
      await fetch("/api/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicAddress: publicKey.toBase58() }),
      });
    }
  };

  if (checking) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-foreground">
        <div>Loading...</div>
      </main>
    );
  }

  if (connected && !hasSignedTerms) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-foreground">
        <TermsOfService onSign={handleTermsSigned} />
      </main>
    );
  }

  return <StrategyDashboardPage searchParams={searchParams}/>;
}
