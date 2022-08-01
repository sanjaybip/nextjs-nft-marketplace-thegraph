import { gql } from "@apollo/client";

const getActiveItems = gql`
    {
        activeItems(first: 10, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            seller
            nftAddress
            tokenId
            price
        }
    }
`;
export default getActiveItems;
