import type { AppProps } from "next/app";
import PageWrapper from "resolves/app/PageWrapper";
import "../app/globals.css";
import { useRouter } from "next/navigation";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <>
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button onClick={() => router.push("/")}>
            <h1 className="text-xl">7on7 Scoring</h1>
          </button>
        </div>
      </header>

      <PageWrapper>
        <Component {...pageProps} />
      </PageWrapper>
    </>
  );
}
