'use client';

import { useState } from 'react';
import { ConnectButton } from '@coinbase/onchainkit/wallet';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import greetingAbi from '../abis/greeting.json'; // Import the ABI

export default function Home() {
  // --- Wallet Connection State ---
  const { address, isConnected } = useAccount();

  // --- State for the new greeting input ---
  const [newGreeting, setNewGreeting] = useState('');

  // --- Contract Configuration ---
  const contractAddress = '0xYourContractAddressHere'; // ⚠️ PASTE YOUR DEPLOYED CONTRACT ADDRESS HERE
  const contractConfig = {
    address: contractAddress as `0x${string}`,
    abi: greetingAbi,
  };

  // --- Wagmi Hook for Reading the 'greet' function ---
  const { data: currentGreeting, isLoading: isGreetingLoading } = useReadContract({
    ...contractConfig,
    functionName: 'greet',
  });

  // --- Wagmi Hook for Writing to the 'setGreeting' function ---
  const { writeContract, isPending: isSettingGreeting } = useWriteContract();

  // --- Function to handle setting the new greeting ---
  const handleSetGreeting = () => {
    if (!newGreeting) return; // Don't do anything if input is empty
    writeContract({
      ...contractConfig,
      functionName: 'setGreeting',
      args: [newGreeting], // Pass the new greeting as an argument
    });
  };

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Greeting dApp on Base Sepolia</h1>
      <ConnectButton />

      {/* Only show contract interaction UI if wallet is connected */}
      {isConnected && (
        <div style={{ marginTop: '1.5rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h2>Contract Interaction</h2>
          <p>
            <strong>Contract Address:</strong> {contractAddress}
          </p>
          
          <div style={{ margin: '1rem 0' }}>
            <strong>Current Greeting:</strong>{' '}
            <span>{isGreetingLoading ? 'Loading...' : String(currentGreeting)}</span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />

          <h3>Set a New Greeting</h3>
          <input
            type="text"
            placeholder="Enter new greeting"
            value={newGreeting}
            onChange={(e) => setNewGreeting(e.target.value)}
            style={{ padding: '8px', marginRight: '8px', width: '70%' }}
          />
          <button onClick={handleSetGreeting} disabled={isSettingGreeting}>
            {isSettingGreeting ? 'Saving...' : 'Save Greeting'}
          </button>
        </div>
      )}
    </main>
  );
}