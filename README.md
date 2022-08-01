# NFT Marketplace frontend using NextJs and Thegraph.

This is a frontend part of the NFT marketplace that allows a web3 user to interact with the [smart contract](https://github.com/sanjaydefidev/hardhat-nft-marketplace-smart-contracts) developed using hardhat. It is developed using NextJs and [web3uikit](https://web3uikit.com/) as frontend stack. To store and index the NFTes and data associated with it, we have used [TheGraph](https://thegraph.com/) protocol. 

The data is queried using subgraph deployed on [subgraph studio](https://github.com/sanjaydefidev/nft-marketplace-thegraph).

The interface show recently listed NFT. It allows owner to update the price of listed NFT and a normal user can buy it. It also allows you to list your NFT at the marketplace so that other can buy it. The seller can withdraw the proceeds that he earn by selling the NFTes.

---

## Running the code
To run the code in your local development machine copy the repository with the following command. We have used `yarn` package manager to install all dependencies. You can use `NPM`. Make sure you have deployed [NFT Marketplace Contract](https://github.com/sanjaydefidev/hardhat-nft-marketplace-smart-contracts) on `Rinkeby` testnet.

```shell
git clone https://github.com/sanjaydefidev/nextjs-nft-marketplace-thegraph
```
Installing all the dependencies
```shell
yarn install
```
---

Check out this [link](https://github.com/PatrickAlphaC/nextjs-nft-marketplace-thegraph-fcc) for more information about this tutorial.

## Note
Thanks to @PatrickAlphaC for creating such a helpful tutorial.
