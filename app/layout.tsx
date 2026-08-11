import { Inter } from "next/font/google";
import "./globals.css";
import TopLoader from "./components/TopLoader";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
        <TopLoader />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
