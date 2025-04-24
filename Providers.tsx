"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "./store/store";

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


{/* <div className="absolute inset-0">
          <Spotlight
            className="-top-40 left-0 md:-top-80 md:left-5"
            fill="white"
          />
        </div> */}