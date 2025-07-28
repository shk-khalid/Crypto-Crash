'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/store/gameStore';
import { gameAPI } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Wallet, Bitcoin, Coins, RefreshCw, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function WalletCard() {
  const { player, wallet, setWallet, setLoading } = useGameStore();

  const fetchWallet = async () => {
    if (!player) return;

    try {
      setLoading(true);
      const response = await gameAPI.getWallet(player.id);
      setWallet(response.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
      toast.error('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (player && !wallet) {
      fetchWallet();
    }
  }, [player]);

  if (!wallet) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Wallet className="w-5 h-5 text-blue-400" />
            <span>Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-slate-400" />
            <span className="ml-2 text-slate-400">Loading wallet...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5 text-blue-400" />
            <span>Wallet</span>
          </div>
          <Button
            onClick={fetchWallet}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* USD Equivalent */}
        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-600 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <Badge variant="outline" className="text-green-300 border-green-600">
                Total USD Value
              </Badge>
            </div>
            <span className="text-2xl font-bold text-green-400">
              ${wallet.usdEquivalent.toFixed(2)}
            </span>
          </div>
        </div>

        <Separator className="bg-slate-600" />
        {/* Crypto Balances */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bitcoin */}
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Bitcoin className="w-5 h-5 text-orange-400" />
              <Badge variant="outline" className="text-orange-300 border-orange-600">
                Bitcoin
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {wallet.btc.toFixed(8)} BTC
              </div>
            </div>
          </div>

          {/* Ethereum */}
          <div className="bg-slate-700 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Coins className="w-5 h-5 text-blue-400" />
              <Badge variant="outline" className="text-blue-300 border-blue-600">
                Ethereum
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">
                {wallet.eth.toFixed(8)} ETH
              </div>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-xs text-slate-400 text-center">
          Last updated: {formatDate(wallet.lastUpdated)}
        </div>
      </CardContent>
    </Card>
  );
}