"use client";

import LiveBlocksProvider from "@/components/LiveBlocksProvider";




const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
};

export default PageLayout;