/**
 * Minimal root layout so Expo Router / Metro can resolve the app when
 * "Using src/app as the root directory for Expo Router".
 * The real app entry is index.ts → App.tsx; this just re-exports it.
 */
import App from '../../App';
export default function RootLayout() {
  return <App />;
}
