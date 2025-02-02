import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  const env = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };

  return (
    <Html>
      <Head />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__ENV = ${JSON.stringify(env)}`,
          }}
        />
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
