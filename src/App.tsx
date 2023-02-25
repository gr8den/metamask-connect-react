import React, { useCallback, useEffect } from 'react';
import { InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core'
import { usePersistentState } from 'react-persistent-state';

import './App.css';

const supportedChainIds = [1];

const Injected = new InjectedConnector({
  supportedChainIds,
  // supportedChainIds: [42]
});


function App() {
  const { activate, deactivate, active, chainId, account } = useWeb3React();
  const [persistentAccount, setPersistentAccount] = usePersistentState('account');

  // auto connect
  useEffect(() => {
    if(!active && persistentAccount) {
      // todo: check persistent account address & chainId if they are changed then disconnect / don't try to connect
      console.log('auto connect');
      activate(Injected);
    } else {
      console.log('skip auto connect');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // maintain persistent account
  useEffect(() => {
    if(account) {
      console.log('set persist', account);
      setPersistentAccount(account);
    }
  }, [account, setPersistentAccount]);

  const disconnect = useCallback(() => {
    console.log('disconnect');
    setPersistentAccount('');
    deactivate();
  }, [deactivate, setPersistentAccount]);

  return (
    <div className="App">
      <h2>Metamask connect</h2>
      <div>Supported chain: Ethereum</div>

      { active ? (
        <div>
          <div>Account: {account}</div>
          <div>Network ID: {chainId}</div>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <div>
          <button onClick={() => { activate(Injected) }}>Connect</button>
        </div>
      ) }
    </div>
  );
}

export default App;
