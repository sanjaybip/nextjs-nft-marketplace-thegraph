import { NextPage } from "next";
import { useQuery, gql } from "@apollo/client";

const getActiveItems = gql`
    {
        activeItems(first: 10, where: { buyer: "0x0000000000000000000000000000000000000000" }) {
            id
            buyer
            seller
            nftAddress
            price
        }
    }
`;

const GraphExample: NextPage = () => {
    const { loading, error, data } = useQuery(getActiveItems);
    console.log(data);

    return <div>Example Page</div>;
};

export default GraphExample;
