"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";

interface MutationMeta {
  invalidateQueries?: QueryKey[];
  customInvalidations?: (() => void)[];
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5000,
    },
  },
  mutationCache: new MutationCache({
    onSuccess: (data, variables, context, mutation) => {
      const meta = mutation.options.meta as MutationMeta | undefined;

      meta?.invalidateQueries?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });

      meta?.customInvalidations?.forEach((invalidationFn) => {
        invalidationFn();
      });
    },
  }),
});

export const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
