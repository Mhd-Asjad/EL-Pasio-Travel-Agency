import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EL PASEO Tours & Travels | Holiday Packages, Resorts & Tickets in Calicut",
  description:
    "EL PASEO Tours & Travels, Mankavu, Calicut (Kozhikode), Kerala. Custom holiday packages, luxury resort stays and flight, train and bus bookings. Journey Beyond Destinations.",
  keywords: [
    "tours and travels Calicut",
    "Kozhikode travel agency",
    "Kerala holiday packages",
    "resort booking Kerala",
    "flight train bus tickets Calicut",
    "EL PASEO Tours & Travels",
  ],
};

export const viewport: Viewport = {
  themeColor: "#0b1b33",
};

export const instant = false;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
