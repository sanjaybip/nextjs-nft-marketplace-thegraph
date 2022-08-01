import { useState } from "react";
import { Input, Modal, Illustration, useNotification, Button } from "web3uikit";
import { useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import Image from "next/image";

interface mainProps {
    nftAddress: string;
    tokenId: string;
    price: number | undefined;
    isVisible: boolean;
    onClose: () => void;
    nftMarketplaceAbi: object;
    marketplaceAddress: string;
    imageUri: string | undefined;
}
const UpdateListingModal = ({
    nftAddress,
    tokenId,
    price,
    isVisible,
    onClose,
    nftMarketplaceAbi,
    marketplaceAddress,
    imageUri,
}: mainProps) => {
    const [newPrice, setNewPrice] = useState<string | undefined>();

    const dispatch = useNotification();

    const { runContractFunction: cancelListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "cancelListing",
        params: {
            nftContractAddress: nftAddress,
            tokenId: tokenId,
        },
    });
    const fnListingCancelled = async (tx: any) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Listing canceled successfully",
            title: "Listing Canceled",
            position: "topR",
        });
        onClose && onClose();
    };

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: nftMarketplaceAbi,
        contractAddress: marketplaceAddress,
        functionName: "updateListing",
        params: {
            nftContractAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(newPrice || "0"),
        },
    });
    const fnListingUpdated = async (tx: any) => {
        await tx.wait(1);
        dispatch({
            type: "success",
            message: "Listing updated successfully",
            title: "Listing Updated - please refresh",
            position: "topR",
        });
        onClose && onClose();
        setNewPrice("0");
    };
    return (
        <Modal
            isVisible={isVisible}
            onOk={() => {
                updateListing({
                    onError: (e) => {
                        console.log(e);
                    },
                    onSuccess: fnListingUpdated,
                });
            }}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            id="modal"
            title="NFT Details"
            okText="Update Listing Price"
            cancelText="Cancel"
            isOkDisabled={!newPrice}
        >
            <div className="flex flex-col items-center gap-4">
                <p className="p-4 text-lg">
                    This is your listing. You may either update the listing price or cancel it.
                </p>
                <div className="flex flex-col items-end gap-2 border-solid border-2 border-gray-400 rounded p-2 w-fit">
                    <div>#{tokenId}</div>
                    {imageUri ? (
                        <Image loader={() => imageUri} src={imageUri} height="200" width="200" />
                    ) : (
                        <Illustration height="180px" logo="lazyNft" width="100%" />
                    )}
                    <div className="font-bold">{ethers.utils.formatEther(price || 0)} ETH</div>
                </div>
                <Input
                    label="Update Listing Price in ETH"
                    type="number"
                    name="New Price"
                    onChange={(e) => {
                        setNewPrice(e.target.value);
                    }}
                />
                or
                <Button
                    id="cancel-listing"
                    text="Cancel Listing"
                    theme="colored"
                    color="red"
                    type="button"
                    onClick={() =>
                        cancelListing({
                            onError: (e) => console.log(e),
                            onSuccess: fnListingCancelled,
                        })
                    }
                />
            </div>
        </Modal>
    );
};
export default UpdateListingModal;
