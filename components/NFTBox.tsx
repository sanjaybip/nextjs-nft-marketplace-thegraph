import type { NextPage } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Card, Tooltip, Illustration, useNotification } from "web3uikit";
import { ethers } from "ethers";

import UpdateListingModal from "./UpdateListingModal";
import nftMarketplaceAbi from "../constants/nftMarketplace.json";
import basicNftAbi from "../constants/basicNft.json";

interface NFTBoxProps {
    price?: number;
    nftAddress: string;
    tokenId: string;
    marketplaceAddress: string;
    seller?: string;
}
const truncateStr = (fullStr: string, strLen: number) => {
    if (fullStr.length <= strLen) return fullStr;

    const separator = "...";

    var sepLen = separator.length,
        charsToShow = strLen - sepLen,
        frontChars = Math.ceil(charsToShow / 2),
        backChars = Math.floor(charsToShow / 2);

    //return fullStr.substr(0, frontChars) + separator + fullStr.substr(fullStr.length - backChars);
    return (
        fullStr.substring(0, frontChars) +
        separator +
        fullStr.substring(fullStr.length - backChars)
    );
};
const NFTBox: NextPage<NFTBoxProps> = ({
    price,
    nftAddress,
    tokenId,
    marketplaceAddress,
    seller,
}: NFTBoxProps) => {
    const { isWeb3Enabled, account } = useMoralis();
    const [imageUri, setImageUri] = useState<string | undefined>();
    const [tokenName, setTokenName] = useState<string | undefined>();
    const [tokenDescription, setTokenDescription] = useState<string | undefined>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const dispatch = useNotification();

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: basicNftAbi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },
    });

    const { runContractFunction: buyNft } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftContractAddress: nftAddress,
            tokenId: tokenId,
        },
    });

    async function updateUI() {
        // get the token uri
        // and then get image tage from token uri
        const tokenUri = (await getTokenURI()) as string;
        console.log(`TokenURI is: ${tokenUri}`);
        if (tokenUri) {
            // Using IPFS gateway to convert ipfs url to a normal http url;
            // ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json
            const requestUrl = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
            const tokenUriRespo = await (await fetch(requestUrl)).json();
            const imageUri = tokenUriRespo.image;
            const imageUrl = imageUri.replace("ipfs://", "https://ipfs.io/ipfs/");
            setImageUri(imageUrl);
            setTokenName(tokenUriRespo.name);
            setTokenDescription(tokenUriRespo.description);
        }
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled]);
    const isOwnedByUser = seller === account || seller === undefined;
    const formattedSellerAddress = isOwnedByUser ? "You" : truncateStr(seller, 15);

    const fnBuyItemSuccess = async (tx: any) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Item bought successfully",
            title: "Item Bought",
            position: "topR",
        });
    };
    const handleCardClick = () => {
        isOwnedByUser
            ? setShowModal(true)
            : buyNft({
                  onSuccess: (tx) => fnBuyItemSuccess(tx),
                  onError: (e) => console.log(e),
              });
    };
    const hideModal = () => setShowModal(false);
    const isListed = seller !== undefined;
    const tooltipContent = isListed
        ? isOwnedByUser
            ? "Update Listing"
            : "Buy this Item"
        : "Create Listing";

    return (
        <div className="p-2">
            <UpdateListingModal
                nftAddress={nftAddress}
                tokenId={tokenId}
                price={price}
                isVisible={showModal}
                onClose={hideModal}
                nftMarketplaceAbi={nftMarketplaceAbi}
                marketplaceAddress={marketplaceAddress}
                imageUri={imageUri}
            />
            <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                <Tooltip content={tooltipContent} position="top">
                    <div className="p-2">
                        {imageUri ? (
                            <div className="flex flex-col items-end gap-2">
                                <div>#{tokenId}</div>
                                <div className="italic text-sm">
                                    Owned by {formattedSellerAddress}
                                </div>
                                <Image
                                    src={imageUri}
                                    height="200"
                                    width="200"
                                    loader={() => imageUri}
                                />
                                {price && (
                                    <div className="font-bold">
                                        {ethers.utils.formatUnits(price, "ether")} ETH
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <Illustration height="180px" logo="lazyNft" width="100%" />
                                Loading...
                            </div>
                        )}
                    </div>
                </Tooltip>
            </Card>
        </div>
    );
};
export default NFTBox;
