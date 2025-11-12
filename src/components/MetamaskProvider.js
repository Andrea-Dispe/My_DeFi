import React, { useEffect, useState } from 'react'
import { Injected } from '../connectors'
import { useWeb3React } from '@web3-react/core'

function MetamaskProvider({ children }) {
  const { active, error, activate } = useWeb3React()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Check if MetaMask is installed
    const { ethereum } = window

    if (ethereum && ethereum.isMetaMask) {
      // Check if previously authorized
      Injected.isAuthorized()
        .then((isAuthorized) => {
          console.log('Is authorized:', isAuthorized)
          if (isAuthorized && !active && !error) {
            // Remove the third parameter (suppressAndThrowErrors) to allow proper error handling
            activate(Injected)
              .then(() => {
                console.log('Successfully auto-connected to MetaMask')
              })
              .catch((err) => {
                console.error('Auto-connect failed:', err)
                // Even if auto-connect fails, still set loaded
                setLoaded(true)
              })
          } else {
            setLoaded(true)
          }
        })
        .catch((err) => {
          console.error('isAuthorized check failed:', err)
          setLoaded(true)
        })
    } else {
      console.warn('MetaMask not detected')
      setLoaded(true)
    }
  }, [activate, active, error])

  // Always render children, don't wait for loading
  return <>{children}</>
}

export default MetamaskProvider