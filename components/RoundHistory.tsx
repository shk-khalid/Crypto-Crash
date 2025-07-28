'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { gameAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function RoundHistory() {
  const { roundHistory, addToHistory } = useGameStore();

  const fetchRoundHistory = async () => {
    try {
      const response = await gameAPI.getRounds(20);
      response.data.forEach((round: any) => addToHistory(round));
    } catch (error) {
      console.error('Error fetching round history:', error);
      toast.error('Failed to fetch round history');
    }
  };

  useEffect(() => {
    if (roundHistory.length === 0) {
      fetchRoundHistory();
    }
  }, []);

  const getCrashColor = (crashPoint: number) => {
    if (crashPoint < 1.5) return 'text-red-400';
    if (crashPoint < 3) return 'text-yellow-400';
    if (crashPoint < 10) return 'text-green-400';
    return 'text-purple-400';
  };

  const getCrashVariant = (crashPoint: number): "default" | "secondary" | "destructive" | "outline" => {
    if (crashPoint < 1.5) return 'destructive';
    if (crashPoint < 3) return 'secondary';
    if (crashPoint < 10) return 'default';
    return 'outline';
  };
  const getCrashIcon = (crashPoint: number) => {
    return crashPoint > 2 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />;
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <History className="w-5 h-5 text-purple-400" />
          <span>Round History</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {roundHistory.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            No round history available
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-2 pr-4">
            {roundHistory.map((round) => (
              <div
                key={round.id}
                className="flex items-center justify-between p-3 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
              >
                <div className="flex items-center space-x-3">
  <Badge variant="outline" className="text-slate-300 border-slate-500">
    {round.id.slice(0, 6)}...
  </Badge>
  <Badge variant={getCrashVariant(round.crashPoint)} className="font-mono">
    {round.crashPoint.toFixed(2)}x
  </Badge>
  <span className="text-slate-300">
    {round.bets.length} bet{round.bets.length !== 1 ? 's' : ''}
  </span>
</div>

                
                {round.crashPoint && (
                  <div className={`flex items-center space-x-1 font-bold ${getCrashColor(round.crashPoint)}`}>
                    {getCrashIcon(round.crashPoint)}
                    <span className="font-mono">{round.crashPoint.toFixed(2)}x</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}