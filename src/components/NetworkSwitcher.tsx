import React, { FunctionComponent } from "react";
import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { useNetwork, useSwitchNetwork } from "wagmi";

export const NetworkSwitcher: FunctionComponent = () => {
  const { chain } = useNetwork();
  const { chains, error, switchNetwork } = useSwitchNetwork();

  return (
    <>
      <FormControl>
        <FormLabel>Crypto Network</FormLabel>
        <Select
          placeholder="Select a network"
          value={chain?.id}
          onChange={(e) => {
            switchNetwork?.(Number(e.target.value));
          }}
        >
          {chains.map((chain) => (
            <option key={chain.id} value={chain.id}>
              {chain.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <div>{error && (error?.message ?? "Failed to switch")}</div>
    </>
  );
};
