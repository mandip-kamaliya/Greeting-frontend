/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

// Import necessary React hooks and components
import { useState , useEffect } from 'react';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';


import greetingAbi from '../abis/greeting.json';

export default function Home() {
  
  const contractAddress = '0x45ec0E1EbBC9Ed306a255A68218b31c7273BAcCe'; // ⚠️ <--- PASTE YOUR ADDRESS HERE

  // --- Wagmi hook to get connected account info ---
  const { address, isConnected } = useAccount();

  // --- React hook to manage the input field's state ---
  const [newGreeting, setNewGreeting] = useState('');

  // --- Reusable contract configuration object ---
  const contractConfig = {
    address: contractAddress as `0x${string}`,
    abi: greetingAbi,
  };

  // --- HOOK TO READ FROM THE CONTRACT ---
  const { data: currentGreeting, isLoading: isGreetingLoading, refetch } = useReadContract({
    ...contractConfig,
    functionName: 'greet',
    
    query: { enabled: isConnected }, 
  });

  
  const { data: hash, writeContract, isPending: isSettingGreeting } = useWriteContract();

  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
      hash,
  });

 
  const handleSetGreeting = async () => {
    if (!newGreeting) return; // Prevent empty submissions
    writeContract({
      ...contractConfig,
      functionName: 'setGreeting',
      args: [newGreeting],
    });
  };

  
useEffect(() => {
  if (isConfirmed) {
    refetch();
  }
}, [isConfirmed, refetch]);


 
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
      <h1>Greeting dApp on Base Sepolia</h1>
      <p>A simple frontend to read and write to a smart contract.</p>
      
      <div style={{ margin: '1rem 0' }}>
        <ConnectWallet />
      </div>

      {/* Show contract UI only if wallet is connected */}
      {isConnected ? (
        <div style={{ marginTop: '1.5rem', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px' }}>
          <h2>Contract Interaction</h2>
          <p style={{ wordWrap: 'break-word' }}>
            <strong>Contract Address:</strong> {contractAddress}
          </p>
          
          <div style={{ margin: '1rem 0' }}>
            <strong>Current Greeting:</strong>{' '}
            <span>
              {isGreetingLoading ? 'Fetching from blockchain...' : String(currentGreeting)}
            </span>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />

          <h3>Set a New Greeting</h3>
          <input
            type="text"
            placeholder="Hello Base!"
            value={newGreeting}
            onChange={(e) => setNewGreeting(e.target.value)}
            style={{ padding: '8px', marginRight: '8px', width: '70%', borderRadius: '4px', border: '1px solid #ccc' }}
            disabled={isSettingGreeting || isConfirming}
          />
          <button onClick={handleSetGreeting} disabled={isSettingGreeting || isConfirming}>
            {isSettingGreeting ? 'Sending...' : isConfirming ? 'Confirming...' : 'Save Greeting'}
          </button>
          
          {isConfirmed && <p style={{ color: 'green' }}>Transaction successful!</p>}
          {hash && <p>Transaction Hash: {hash.slice(0,10)}...{hash.slice(-8)}</p>}
        </div>
      ) : (
        <p>Please connect your wallet to interact with the contract.</p>
      )}
    </main>
  );
}