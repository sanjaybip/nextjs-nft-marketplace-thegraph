import type { NextPage } from "next";
import { useMoralis } from "react-moralis";
import { useQuery } from "@apollo/client";

import networkMapping from "../constants/networkMapping.json";
import getActiveItems from "../constants/subgraphQueries";
import NFTBox from "../components/NFTBox";

const Home: NextPage = () => {
    const { chainId, isWeb3Enabled } = useMoralis();
    const chainString = chainId ? parseInt(chainId).toString() : null;

    const marketplaceAddress = chainString
        ? (networkMapping as any)[chainString].NftMarketplace[0]
        : null;

    const { loading, error, data: activeNfts } = useQuery(getActiveItems);
    console.log(activeNfts);

    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            <div className="flex flex-wrap">
                {isWeb3Enabled ? (
                    loading || !activeNfts ? (
                        <div>Loading...</div>
                    ) : (
                        activeNfts.activeItems.map((nft: any) => {
                            const { price, nftAddress, tokenId, seller } = nft;
                            return (
                                <NFTBox
                                    price={price}
                                    nftAddress={nftAddress}
                                    tokenId={tokenId}
                                    marketplaceAddress={marketplaceAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            );
                        })
                    )
                ) : (
                    <div>Web3 Currently Not Enabled</div>
                )}
            </div>
        </div>
    );
};

export default Home;
