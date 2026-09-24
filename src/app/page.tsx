"use client";

import { DisclaimerBanner } from "@/components/site/DisclaimerBanner";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Features } from "@/components/site/Features";
import { InfoCards } from "@/components/site/InfoCards";
import { News } from "@/components/site/News";
import { Footer } from "@/components/site/Footer";
import { BookingProvider } from "@/components/site/booking/BookingContext";
import { BookingFlow } from "@/components/site/booking/BookingFlow";

export default function Page() {
  return (
    <BookingProvider>
      <div className="min-h-screen bg-background">
        <DisclaimerBanner />
        <Header />
        <main>
          <Hero />
          <BookingFlow />
          <InfoCards />
          <Features />
          <News />
        </main>
        <Footer />
      </div>
    </BookingProvider>
  );
}

