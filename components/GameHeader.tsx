'use client';

import { useGameStore } from '@/store/gameStore';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';

export default function GameHeader() {
  const { currentRound, timeLeft, setTimeLeft, connected } = useGameStore();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(Math.max(0, timeLeft - 1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, setTimeLeft]);

  if (!currentRound) {
    return (
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-slate-300">Waiting for next round...</span>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'text-yellow-400';
      case 'betting': return 'text-blue-400';
      case 'active': return 'text-green-400';
      case 'crashed': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'waiting': return 'secondary';
      case 'betting': return 'default';
      case 'active': return 'outline';
      case 'crashed': return 'destructive';
      default: return 'secondary';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting': return <Clock className="w-5 h-5" />;
      case 'betting': return <Users className="w-5 h-5" />;
      case 'active': return <TrendingUp className="w-5 h-5" />;
      case 'crashed': return '💥';
      default: return <Clock className="w-5 h-5" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl border border-slate-700 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className="text-sm text-slate-300">
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>

        {/* Round Info */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Round</span>
          <Badge variant="outline" className="text-white border-slate-600">
            #{currentRound.roundNumber}
          </Badge>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div className={getStatusColor(currentRound.status)}>
            {getStatusIcon(currentRound.status)}
          </div>
          <Badge variant={getStatusVariant(currentRound.status)} className="capitalize">
            {currentRound.status}
          </Badge>
        </div>

        {/* Timer or Multiplier */}
        <div className="flex items-center justify-end space-x-2">
          {currentRound.status === 'betting' && timeLeft > 0 ? (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <Badge variant="default" className="bg-blue-600 text-white">
                {timeLeft}s
              </Badge>
            </div>
          ) : currentRound.status === 'active' ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-400">Multiplier</span>
              <span className="text-2xl font-bold text-green-400 font-mono">
                {currentRound.multiplier.toFixed(2)}x
              </span>
            </div>
          ) : currentRound.status === 'crashed' && currentRound.crashPoint ? (
            <div className="flex items-center space-x-2">
              <span className="text-lg">💥</span>
              <span className="text-xl font-bold text-red-400 font-mono">
                {currentRound.crashPoint.toFixed(2)}x
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}