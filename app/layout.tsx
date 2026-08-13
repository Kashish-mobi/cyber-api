import { Inter } from "next/font/google";
import ReduxProvider from "@/redux/provider";
import "./globals.css";
import TopLoader from "./components/TopLoader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import GlobalLoader from "./components/Loader";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <ReduxProvider>
          <TopLoader />
          <GlobalLoader />
          <Header />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}
