import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DestinationDetail } from "@/components/destination-detail";
import { SmoothScroll } from "@/components/smooth-scroll";
import {
  getDestination,
  getDestinations,
  getPackagesByDestination,
} from "@/lib/db";

export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const destination = await getDestination(id);
  if (!destination) {
    return { title: "Destination | EL PASEO Tours & Travels" };
  }
  return {
    title: `${destination.title} packages | EL PASEO Tours & Travels`,
    description: `Holiday packages for ${destination.title}${
      destination.region ? `, ${destination.region}` : ""
    }. Plan a tailored journey with EL PASEO Tours & Travels, Calicut.`,
  };
}

export default async function DestinationPage({ params }: Props) {
  const { id } = await params;
  const destination = await getDestination(id);
  if (!destination) notFound();

  const [packages, allDestinations] = await Promise.all([
    getPackagesByDestination(destination.id),
    getDestinations(),
  ]);
  packages.sort(
    (a, b) => Number(b.featured !== false) - Number(a.featured !== false),
  );
  const moreDestinations = allDestinations
    .filter((d) => d.id !== destination.id)
    .slice(0, 3);

  return (
    <SmoothScroll>
      <main>
        <DestinationDetail
          destination={destination}
          packages={packages}
          moreDestinations={moreDestinations}
        />
      </main>
    </SmoothScroll>
  );
}
