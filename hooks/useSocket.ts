import { useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useGameStore } from '@/store/gameStore';
import { initSocket, disconnectSocket } from '@/lib/socket';
import type { Round, Bet, GameFeedItem, Wallet } from '@/store/gameStore';

export const useSocket = () => {
  const {
    player,
    socket,
    connected,
    setSocket,
    setConnected,
    setCurrentRound,
    setCurrentBet,
    updateMultiplier,
    addToHistory,
    addToFeed,
    setWallet,
    setTimeLeft,
    setError,
  } = useGameStore();

  const connectSocket = useCallback(() => {
    if (!socket && player) {
      const newSocket = initSocket();
      setSocket(newSocket);

      // Connection events
      newSocket.on('connect', () => {
        console.log('Connected to game server');
        setConnected(true);
        setError(null);
        toast.success('Connected to game!');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from game server');
        setConnected(false);
        toast.error('Disconnected from game');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Connection error:', error);
        setConnected(false);
        setError('Failed to connect to game server');
        toast.error('Connection failed');
      });

      // Game events
      newSocket.on('round_start', (data: Round) => {
        console.log('Round started:', data);
        setCurrentRound(data);
        setCurrentBet(null);
        setTimeLeft(10); // 10 second betting window
        addToFeed({
          id: Date.now().toString(),
          type: 'round_start',
          message: `Round ${data.roundNumber} started! Place your bets!`,
          timestamp: new Date().toISOString(),
        });
        toast.success(`Round ${data.roundNumber} started!`);
      });

      newSocket.on('multiplier_update', (data: { multiplier: number }) => {
        updateMultiplier(data.multiplier);
      });

      newSocket.on('round_end', (data: Round) => {
        console.log('Round ended:', data);
        setCurrentRound(data);
        addToHistory(data);
        setTimeLeft(0);
        
        if (data.crashPoint) {
          addToFeed({
            id: Date.now().toString(),
            type: 'crash',
            message: `💥 Crashed at ${data.crashPoint.toFixed(2)}x!`,
            timestamp: new Date().toISOString(),
          });
          toast.error(`Crashed at ${data.crashPoint.toFixed(2)}x!`);
        }
      });

      newSocket.on('bet_placed', (data: { bet: Bet; playerName: string }) => {
        console.log('Bet placed:', data);
        if (data.bet.playerId === player.id) {
          setCurrentBet(data.bet);
          toast.success(`Bet placed: $${data.bet.usdAmount} in ${data.bet.currency}`);
        }
        
        addToFeed({
          id: Date.now().toString(),
          type: 'bet_placed',
          message: `${data.playerName} bet $${data.bet.usdAmount} in ${data.bet.currency}`,
          timestamp: new Date().toISOString(),
          playerId: data.bet.playerId,
          playerName: data.playerName,
        });
      });

      newSocket.on('player_cashout', (data: { bet: Bet; playerName: string }) => {
        console.log('Player cashed out:', data);
        if (data.bet.playerId === player.id) {
          setCurrentBet(data.bet);
          if (data.bet.winAmount) {
            toast.success(`Cashed out! Won $${data.bet.winAmount.toFixed(2)}`);
          }
        }
        
        addToFeed({
          id: Date.now().toString(),
          type: 'cashout',
          message: `${data.playerName} cashed out at ${data.bet.multiplier?.toFixed(2)}x for $${data.bet.winAmount?.toFixed(2)}`,
          timestamp: new Date().toISOString(),
          playerId: data.bet.playerId,
          playerName: data.playerName,
        });
      });

      newSocket.on('wallet_data', (data: Wallet) => {
        console.log('Wallet updated:', data);
        setWallet(data);
      });

      newSocket.on('cashout_success', (data: { bet: Bet }) => {
        console.log('Cashout success:', data);
        setCurrentBet(data.bet);
        if (data.bet.winAmount) {
          toast.success(`Successfully cashed out! Won $${data.bet.winAmount.toFixed(2)}`);
        }
      });

      newSocket.on('bet_placed_success', (data: { bet: Bet }) => {
        console.log('Bet placed success:', data);
        setCurrentBet(data.bet);
        toast.success('Bet placed successfully!');
      });

      newSocket.on('error', (data: { message: string }) => {
        console.error('Game error:', data);
        setError(data.message);
        toast.error(data.message);
      });

      return newSocket;
    }
  }, [player, socket]);

  const disconnectFromGame = useCallback(() => {
    disconnectSocket();
    setSocket(null);
    setConnected(false);
  }, []);

  const placeBet = useCallback((usdAmount: number, currency: 'BTC' | 'ETH') => {
    if (socket && connected) {
      socket.emit('place_bet', { usdAmount, currency });
    } else {
      toast.error('Not connected to game server');
    }
  }, [socket, connected]);

  const cashOut = useCallback(() => {
    if (socket && connected) {
      socket.emit('cashout_request', {});
    } else {
      toast.error('Not connected to game server');
    }
  }, [socket, connected]);

  useEffect(() => {
    if (player && !socket) {
      connectSocket();
    }

    return () => {
      if (!player) {
        disconnectFromGame();
      }
    };
  }, [player, socket, connectSocket, disconnectFromGame]);

  return {
    connected,
    connectSocket,
    disconnectFromGame,
    placeBet,
    cashOut,
  };
};