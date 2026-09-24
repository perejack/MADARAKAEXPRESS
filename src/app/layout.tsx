import "@/styles.css";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: `${siteConfig.businessName} — Independent SGR Train Ticket Booking`,
  description:
    "Book SGR and Madaraka Express train tickets through RailBook Kenya, a private independent booking platform. Not affiliated with Kenya Railways or the Government of Kenya.",
  openGraph: {
    title: `${siteConfig.businessName} — Private SGR Ticket Booking`,
    description:
      "Independent online booking for Kenya SGR rail routes. We are not the official Kenya Railways website.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
