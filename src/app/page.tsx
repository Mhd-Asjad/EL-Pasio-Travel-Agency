import { About } from "@/components/about";
import { Destinations } from "@/components/destinations";
import { Hero } from "@/components/hero";
import { Packages } from "@/components/packages";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <About />
        <Packages />
        <Destinations />
        <Testimonials />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
