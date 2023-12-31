import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";

import "../styles/globals.css";

import PlayerProvider from "../providers/PlayerProvider";

export default function App({ Component, pageProps, router }: AppProps) {
  return (
    <main>
      <PlayerProvider>
        <Component {...pageProps} />
      </PlayerProvider>
      <Analytics />
      <a href="https://github.com/dustywusty/dmud.dusty.wtf" target="_blank" className="pi-icon">&#960;</a>
    </main>
  );
}