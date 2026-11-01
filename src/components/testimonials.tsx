import { Parallax, Reveal } from "./motion";
import {
  TestimonialCarousel,
  type Testimonial,
} from "./testimonial-carousel";
import { Eyebrow, bodyClass } from "./ui";

// Sample reviews for the design. Replace with real customer feedback
// (with permission) before launch.
const ITEMS: Testimonial[] = [
  {
    id: "anjali",
    avatar: "/images/avatars/anjali.jpg",
    name: "Anjali Menon",
    from: "Kochi",
    title: "Everything was taken care of.",
    body: "It was our first trip abroad and we were nervous. The EL PASEO team booked our flights, the resort and the airport pickup. We only had to enjoy. Our water villa was exactly like the photos they showed us.",
    trip: "Maldives honeymoon",
    date: "September 2026",
  },
  {
    id: "rahul",
    avatar: "/images/avatars/rahul.jpg",
    name: "Rahul Nair",
    from: "Kozhikode",
    title: "Simple, and no stress.",
    body: "I called on Monday and by Wednesday I had a full plan for Munnar with the hotel, a car and a tea estate visit. The price was fair and there were no hidden charges at all.",
    trip: "Munnar weekend",
    date: "August 2026",
  },
  {
    id: "fathima",
    avatar: "/images/avatars/fathima.jpg",
    name: "Fathima Rasheed",
    from: "Calicut",
    title: "Perfect for a big family.",
    body: "Travelling with children and my parents is never easy. They chose a hotel near the metro and kept slow days for my father. Everyone came back happy and nobody was tired.",
    trip: "Dubai with family",
    date: "October 2026",
  },
  {
    id: "suresh",
    avatar: "/images/avatars/suresh.jpg",
    name: "Suresh Pillai",
    from: "Thrissur",
    title: "Not like a normal tour.",
    body: "I thought it would be a bus tour with a flag in front. Instead we got a private driver, a quiet villa in Ubud and time to rest. The plan felt made for us, not copied from a list.",
    trip: "Bali, 6 nights",
    date: "July 2026",
  },
  {
    id: "deepa",
    avatar: "/images/avatars/deepa.jpg",
    name: "Deepa Krishnan",
    from: "Palakkad",
    title: "They picked up every call.",
    body: "Our train tickets changed at the last minute. The team fixed it in one hour, even on a Sunday. I did not have to worry for a single second.",
    trip: "Train and houseboat",
    date: "June 2026",
  },
  {
    id: "arjun",
    avatar: "/images/avatars/arjun.jpg",
    name: "Arjun Varma",
    from: "Kannur",
    title: "Good value for a group.",
    body: "We were eight friends with different budgets. They found rooms that worked for everyone and kept the trip on time. We have already asked them to plan our next one.",
    trip: "Manali with friends",
    date: "May 2026",
  },
];

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="relative isolate overflow-hidden border-t border-cream/10 bg-navy-950 text-cream"
    >
      <Parallax
        distance={90}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[30%] h-[36rem] w-[70rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.35_0.08_258/0.55),transparent)]" />
        <div className="absolute left-1/2 top-[55%] h-[22rem] w-[36rem] max-w-none -translate-x-1/2 bg-[radial-gradient(closest-side,oklch(0.73_0.125_80/0.08),transparent)]" />
      </Parallax>

      <div className="relative py-14 md:py-16">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center px-5 text-center md:px-10">
          <Reveal>
            <Eyebrow className="!text-xl !font-semibold !tracking-[0.4em] md:!text-3xl md:!tracking-[0.45em]">Travellers Say</Eyebrow>
          </Reveal>

          <h2 id="testimonials-title" className="sr-only">They came back with stories</h2>

          <Reveal className="mt-8">
            <p
              className={`max-w-[52ch] text-pretty text-[1rem] font-normal leading-[1.8] md:text-[1.15rem] ${bodyClass}`}
            >
              From first trips to many trips, here is what our travellers say
              about planning with us.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-10 md:mt-14" y={48}>
          <TestimonialCarousel items={ITEMS} />
        </Reveal>
      </div>
    </section>
  );
}
