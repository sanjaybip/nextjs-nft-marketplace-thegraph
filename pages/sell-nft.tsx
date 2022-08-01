import type { NextPage } from "next";
import { Form, Button, useNotification } from "web3uikit";
import { ethers } from "ethers";
import { useWeb3Contract, useMoralis } from "react-moralis";
import { useEffect, useState } from "react";

import basicNftAbi from "../constants/basicNft.json";
import nftMarketplaceAbi from "../constants/nftMarketplace.json";
import networkMapping from "../constants/networkMapping.json";

const sellPage: NextPage = () => {
    const dispatch = useNotification();
    const { chainId, account, isWeb3Enabled } = useMoralis();
    const chainString = chainId ? parseInt(chainId).toString() : "31337";

    const marketplaceAddress = (networkMapping as any)[chainString].NftMarketplace[0];

    const [proceeds, setProceeds] = useState("0");

    //@ts-ignore
    const { runContractFunction } = useWeb3Contract();

    // getProceed on UI
    const proceedOptions = {
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "getProceeds",
        params: { seller: account },
    };
    async function setupUI() {
        const returnedProceeds = (await runContractFunction({
            params: proceedOptions,
            onError: (e) => console.log(e),
        })) as string;
        if (returnedProceeds) {
            setProceeds(returnedProceeds);
        }
    }
    useEffect(() => {
        setupUI();
    }, [proceeds, account, chainId, isWeb3Enabled]);

    // withdraw Proceeds when seleer have balance by clikcing button
    const withdrawProceeds = async () => {
        console.log(`withDrawing Proceeds...`);

        const withdrawOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "withdrawSellerMoney",
            params: {},
        };
        await runContractFunction({
            params: withdrawOptions,
            onSuccess: (tx) => fnWithdrawSuccess(tx),
            onError: (e) => console.log(e),
        });
    };

    const fnWithdrawSuccess = async (tx: any) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Proceeds withdrawn successfully",
            title: "Proceeds Withdrawn",
            position: "topR",
        });
    };

    // Approve a minted NFT
    const approveAndList = async (data: any) => {
        console.log(`Approving...`);
        const nftAddress = data.data[0].inputResult;
        const tokenId = data.data[1].inputResult;
        const price = ethers.utils.parseEther(data.data[2].inputResult).toString();

        const approveOptions = {
            abi: basicNftAbi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: { to: marketplaceAddress, tokenId: tokenId },
        };
        await runContractFunction({
            params: approveOptions,
            onSuccess: () => listItem(nftAddress, tokenId, price),
            onError: (e) => console.log(e),
        });
    };

    // List the approved NFT
    const listItem = async (nftAddress: string, tokenId: string, price: string) => {
        console.log(`Listing NFT...`);

        const listingOptions = {
            abi: nftMarketplaceAbi,
            contractAddress: marketplaceAddress,
            functionName: "listItem",
            params: { nftContractAddress: nftAddress, tokenId: tokenId, price: price },
        };
        await runContractFunction({
            params: listingOptions,
            onSuccess: (tx) => fnItemSuccess(tx),
            onError: (e) => console.log(e),
        });
    };

    const fnItemSuccess = async (tx: any) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "NFT Listed successfully",
            title: "NFT Listed",
            position: "topR",
        });
    };

    return (
        <div>
            <Form
                onSubmit={approveAndList}
                buttonConfig={{
                    isLoading: false,
                    type: "submit",
                    theme: "primary",
                    text: "Sell NFT!",
                }}
                data={[
                    { name: "NFT Address", type: "text", value: "", key: "nftAddress" },
                    { name: "NFT Token Id", type: "number", value: "", key: "tokenId" },
                    { name: "Price (in ETH)", type: "number", value: "", key: "price" },
                ]}
                title="Sell Your NFT"
                id="main-form"
            />
            <div className="py-4">
                <div className="flex flex-col gap-2 justify-items-start w-fit">
                    <h2 className="text-2xl">
                        Withdraw {ethers.utils.formatUnits(proceeds.toString(), "ether")} proceeds
                    </h2>
                    {proceeds != "0" ? (
                        <p>
                            <Button
                                id="widthdraw-procceds"
                                text="Withdraw"
                                theme="primary"
                                type="button"
                                onClick={withdrawProceeds}
                            />
                        </p>
                    ) : (
                        <p>No withdrawable proceeds detected</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default sellPage;
