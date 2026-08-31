"use client";

import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { queryClientConfig } from "../config/queryClient.config";
import { ApiError } from "../types/errorTypes";
import { NotificationsSocketProvider } from "@/components/layout/NotificationsSocketProvider";

interface QueryClientProviderTypes {
  children: React.ReactNode;
}

const QueryProvider = ({ children }: QueryClientProviderTypes) => {
  const queryClient = new QueryClient({
    ...queryClientConfig,
    queryCache: new QueryCache({
      onError: (error) => {
        const err = error as unknown as ApiError;
        // toast.error(err.message || "Something went wrong", {
        //   duration: 3000,
        // });
      },
    }),
  });
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsSocketProvider>{children}</NotificationsSocketProvider>
    </QueryClientProvider>
  );
};

export default QueryProvider;
