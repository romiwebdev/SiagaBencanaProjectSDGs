import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* Meta dasar SEO */}
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Muhromin" />
        <meta name="keywords" content="Siaga Bencana, Bojonegoro, Peta Bencana, Web GIS, Pemantauan Bencana, Laporan Bencana, Banjir, Gempa Bumi, Longsor, SDGs, Jawa Timur, Leaflet, OpenStreetMap, Next.js, Tailwind CSS, Sistem Kesiapsiagaan Bencana" />
        <meta name="description" content="SiagaBencanaBojonegoro adalah aplikasi Web GIS responsif berbasis Next.js dan Tailwind CSS untuk monitoring dan pelaporan bencana di Kabupaten Bojonegoro. Mendukung SDGs dan dirancang untuk masyarakat umum." />
        <meta property="og:title" content="SiagaBencanaBojonegoro - Web GIS Bencana Kabupaten Bojonegoro" />
        <meta property="og:description" content="Aplikasi pemantauan dan pelaporan bencana interaktif di Bojonegoro. Tampilkan peta bencana banjir, gempa bumi, dan tanah longsor." />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="id_ID" />
        <meta property="og:site_name" content="SiagaBencanaBojonegoro" />
        <meta property="og:image" content="/og-image.jpg" /> {/* Ubah sesuai file */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SiagaBencanaBojonegoro" />
        <meta name="twitter:description" content="Web GIS bencana untuk monitoring dan laporan di Kabupaten Bojonegoro, mendukung SDGs." />
        <meta name="twitter:image" content="/twitter-image.jpg" /> {/* Ubah sesuai file */}

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="google-site-verification" content="CC6bjZ45EFPO-vkaeJE8sfjrf5umq-IyAiSuhYUyfpc" />
        
        {/* Tailwind Config Inline */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tailwind.config = {
                theme: {
                  extend: {
                    colors: {
                      primary: '#2563eb',
                      secondary: '#1d4ed8',
                      danger: '#dc2626',
                      warning: '#f59e0b',
                      success: '#16a34a',
                    }
                  }
                }
              }
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
