'use client';

import { useEffect, useState } from 'react';
import { getBalanceAction } from '@/app/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DeepgramCredit() {
  const [balance, setBalance] = useState<{ amount: number; units: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBalance() {
      setIsLoading(true);
      const result = await getBalanceAction();
      if (result.error) {
        setError(result.error);
      } else if (result.amount !== undefined && result.units) {
        setBalance({ amount: result.amount, units: result.units });
      }
      setIsLoading(false);
    }
    fetchBalance();
  }, []);

  if (isLoading) {
    return (
        <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-4 w-24" />
        </div>
    );
  }

  if (error) {
    return (
        <Alert variant="destructive" className="py-2 px-3 text-xs">
            <AlertDescription>{error}</AlertDescription>
        </Alert>
    );
  }

  if (balance) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-2 rounded-md">
        <Wallet className="h-4 w-4" />
        <span>
          Deepgram Credit: {new Intl.NumberFormat('en-US', { style: 'currency', currency: balance.units }).format(balance.amount)}
        </span>
      </div>
    );
  }

  return null;
}
