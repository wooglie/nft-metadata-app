import React, { useState } from "react";
import {
  Box,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
  Code,
} from "@chakra-ui/react";
import { useAccount, useConnect, useContractRead } from "wagmi";
import { Connect } from "./components/Connect";
import { NetworkSwitcher } from "./components/NetworkSwitcher";
import axios from "axios";

const erc721ABI = [
  {
    constant: true,
    inputs: [{ name: "_tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "contractURI",
    outputs: [{ name: "", type: "string" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const App: React.FC = () => {
  const [contractAddress, setContractAddress] = useState("");
  const [tokenId, setTokenId] = useState("0");
  const [contractURI, setContractURI] = useState<null | Record<string, any>>(
    null
  );
  const [tokenURI, setTokenURI] = useState<null | Record<string, any>>(null);
  const [contractMetadata, setContractMetadata] = useState<null | Record<
    string,
    any
  >>(null);
  const [metadata, setMetadata] = useState<null | Record<string, any>>(null);

  const { isReconnecting, isConnected } = useAccount();
  const { isLoading: isLoadingProvider } = useConnect();

  const { refetch: fetchTokenURI } = useContractRead({
    abi: erc721ABI,
    address: contractAddress as `0x${string}`,
    functionName: "tokenURI",
    args: [tokenId],

    enabled: false,
  });

  const { refetch: fetchContractURI } = useContractRead({
    abi: erc721ABI,
    address: contractAddress as `0x${string}`,
    functionName: "contractURI",

    enabled: false,
  });

  const fetchMetadata = async () => {
    fetchTokenURI().then((data) => {
      const url = (data.data as string).replace(
        "ipfs://",
        "https://cloudflare-ipfs.com/ipfs/"
      );

      axios.get(url).then((res) => {
        setMetadata(res.data);
      });

      setTokenURI({ tokenURI: data.data });
    });
    fetchContractURI().then((data) => {
      const url = (data.data as string).replace(
        "ipfs://",
        "https://cloudflare-ipfs.com/ipfs/"
      );

      axios.get(url).then((res) => {
        setContractMetadata(res.data);
      });

      setContractURI({ contractURI: data.data });
    });
  };

  return (
    <VStack spacing={4} padding={4}>
      <Connect />
      {(isLoadingProvider || isReconnecting) && <span>Loading..</span>}

      {isConnected && (
        <>
          <NetworkSwitcher />
          <FormControl>
            <FormLabel>Contract Address</FormLabel>
            <Input
              placeholder="Enter the contract address"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Token ID</FormLabel>
            <Input
              type="number"
              placeholder="Enter the token ID"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            onClick={fetchMetadata}
            isDisabled={!contractAddress.length}
          >
            Fetch Metadata
          </Button>

          {metadata && (
            <Box width="100%">
              <Text>Token Metadata:</Text>
              <Code width="100%" whiteSpace="pre-wrap">
                {JSON.stringify(metadata, null, 2)}
              </Code>
            </Box>
          )}
          {contractMetadata && (
            <Box width="100%">
              <Text>Contract Metadata:</Text>
              <Code width="100%" whiteSpace="pre-wrap">
                {JSON.stringify(contractMetadata, null, 2)}
              </Code>
            </Box>
          )}
          {tokenURI && (
            <Box width="100%">
              <Text>Token URI:</Text>
              <Code width="100%" whiteSpace="pre-wrap">
                {JSON.stringify(tokenURI, null, 2)}
              </Code>
            </Box>
          )}
          {contractURI && (
            <Box width="100%">
              <Text>Contract URI:</Text>
              <Code width="100%" whiteSpace="pre-wrap">
                {JSON.stringify(contractURI, null, 2)}
              </Code>
            </Box>
          )}
        </>
      )}
    </VStack>
  );
};

export default App;
