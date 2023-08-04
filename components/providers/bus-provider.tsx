"use client";

import { Provider } from "react-bus";

const BusProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider>{children}</Provider>;
};

export default BusProvider;
