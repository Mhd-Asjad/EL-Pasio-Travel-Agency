import { Destinations } from "@/components/destinations";
import { Hero } from "@/components/hero";
import { Packages } from "@/components/packages";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Testimonials } from "@/components/testimonials";

export const instant = false;

export default async function Home() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <Destinations />
        <Packages />
        <Testimonials />
      </main>
      <SiteFooter />
    </SmoothScroll>
  );
}
