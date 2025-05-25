"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { dark } from "@clerk/themes";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <Provider store={store}>
        <Toaster containerClassName="z-[99999]" />
        {children}
      </Provider>
    </ClerkProvider>
  );
};

export default ClientLayout;
