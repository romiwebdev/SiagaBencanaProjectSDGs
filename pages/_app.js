import '../styles/globals.css';
import Layout from '../components/Layout';
import 'leaflet/dist/leaflet.css';

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}