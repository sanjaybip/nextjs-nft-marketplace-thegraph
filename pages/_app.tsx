import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MoralisProvider } from "react-moralis";
import Head from "next/head";
import { NotificationProvider } from "web3uikit";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

import Header from "../components/Header";

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: process.env.NEXT_PUBLIC_SUBGRAPH_URL,
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT marketplace using moralis" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </>
    );
}

export default MyApp;
