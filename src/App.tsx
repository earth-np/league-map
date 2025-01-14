import { useState } from 'react'
import './App.css'
import TerrainScene from './components/TerrainScene'
import '@rainbow-me/rainbowkit/styles.css';
import {
  ConnectButton,
  getDefaultConfig,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { useAccount, WagmiProvider } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
} from 'wagmi/chains';
import {
  QueryClientProvider,
  QueryClient,
} from "@tanstack/react-query";

const config = getDefaultConfig({
  appName: 'Welcome to LOL',
  projectId: '7a787017895c0f364dc2073c3ffeef76',
  chains: [mainnet, polygon, optimism, arbitrum, base],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();


const Inner = () => {
  const { address } = useAccount();


  if (!address) {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ConnectButton />
        </div>
        <TerrainScene />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '5px',
        zIndex: 1,
      }}>
        <ConnectButton />
      </div>
      <TerrainScene />
    </div>
  );
}

const App = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Inner />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};


export default App
