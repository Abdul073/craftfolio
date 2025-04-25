"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Spotlight } from "./app/portfolio/components/Spotlight";

const ClientLayout = ({children}: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
        <Provider store={store}>
          <Toaster />
          
          {children}
        </Provider>
       </ClerkProvider>
  )
}

export default ClientLayout


