'use client';

import { useGameStore } from '@/store/gameStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Activity, DollarSign, TrendingUp, Play, Zap } from 'lucide-react';

export default function GameFeed() {
  const { gameFeed } = useGameStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'bet_placed': return <DollarSign className="w-4 h-4 text-blue-400" />;
      case 'cashout': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'crash': return <Zap className="w-4 h-4 text-red-400" />;
      case 'round_start': return <Play className="w-4 h-4 text-purple-400" />;
      default: return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTextColor = (type: string) => {
    switch (type) {
      case 'bet_placed': return 'text-blue-300';
      case 'cashout': return 'text-green-300';
      case 'crash': return 'text-red-300';
      case 'round_start': return 'text-purple-300';
      default: return 'text-slate-300';
    }
  };

  const getBadgeVariant = (type: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case 'bet_placed': return 'default';
      case 'cashout': return 'outline';
      case 'crash': return 'destructive';
      case 'round_start': return 'secondary';
      default: return 'secondary';
    }
  };
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-white">
          <Activity className="w-5 h-5 text-green-400" />
          <span>Live Feed</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div className="p-4 space-y-3">
            {gameFeed.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No activity yet
              </div>
            ) : (
              gameFeed.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start space-x-3 p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getBadgeVariant(item.type)} className="text-xs">
                        {item.type.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-slate-500">
                        {formatTime(item.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm ${getTextColor(item.type)}`}>
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}