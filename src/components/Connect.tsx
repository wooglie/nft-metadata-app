import React, { FunctionComponent } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { useIsMounted } from "../core/hooks/useIsMounted";
import { Button, Grid } from "@chakra-ui/react";

export const Connect: FunctionComponent = () => {
  const isMounted = useIsMounted();
  const { address, connector, isReconnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const { connect, connectors, isLoading, error, pendingConnector } =
    useConnect();

  return (
    <div>
      {isConnected && <span>Connected to {address}</span>}
      {!isConnected && <span>Connect Wallet</span>}
      <Grid display="flex" flexDirection="row" gap="4" justifyContent="center">
        {connectors.map((x) => (
          <Button
            colorScheme="blue"
            disabled={!x.ready || isReconnecting || connector?.id === x.id}
            key={x.name}
            onClick={() => connect({ connector: x })}
          >
            {x.id === "injected" ? (isMounted ? x.name : x.id) : x.name}
            {isMounted && !x.ready && " (unsupported)"}
            {isLoading && x.id === pendingConnector?.id && "…"}
          </Button>
        ))}
        {isConnected && (
          <>
            <Button colorScheme="red" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </>
        )}
      </Grid>

      <div>{error && error.message}</div>
    </div>
  );
};
