import { About } from "@/components/about";
import { Destinations } from "@/components/destinations";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <Destinations />
        <Testimonials />
      </main>
      <SiteFooter />
    </>
  );
}
