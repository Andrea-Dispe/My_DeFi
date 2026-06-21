import { render } from '@testing-library/react';
import App from './App';

// sampe test for now
test('renders without crashing', () => {
  Object.defineProperty(window, 'ethereum', {
    value: { isMetaMask: true, request: jest.fn(), on: jest.fn(), removeListener: jest.fn() },
    writable: true,
  });
  expect(() => render(<App />)).not.toThrow();
});
