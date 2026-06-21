// This file augments @mui/styles DefaultTheme so that `makeStyles` callbacks
// receive the full MUI Theme type instead  of the empty `{}` default.  
// Required when using @mui/styles alongside@mui/material in the same project.
import { Theme } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

// Extend the Window interface so TypeScript knows about window.ethereum (MetaMask).
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}
