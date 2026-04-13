import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type Props = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: Props) {
  const [queryClient] = useState(() => {
    return new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 1000 * 30,
          gcTime: 1000 * 60 * 5
        }
      }
    });
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

