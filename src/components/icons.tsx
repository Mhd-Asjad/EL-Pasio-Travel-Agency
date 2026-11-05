import type { SVGProps } from "react";

const base: SVGProps<SVGSVGElement> = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 4h3.2l1.6 4-2 1.3a11 11 0 0 0 5.9 5.9l1.3-2 4 1.6V18a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function ScrollIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="8" y="3" width="8" height="13" rx="4" />
      <path d="M12 6.5v2.5" />
    </svg>
  );
}

export function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h16M4 16h16" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3.500 20.500l1.300-4.600A8.500 8.500 0 1 1 8.200 19.300L3.500 20.500Z" />
      <path d="M9.200 8.600c.2-.5.6-.5.900-.2l.8 1.100c.2.300.1.600-.1.900l-.4.500c.8 1.500 1.900 2.500 3.400 3.200l.6-.6c.3-.3.600-.3.900-.1l1.100.7c.3.200.4.600.1 1-.5.700-1.300 1-2.200.8-3-.8-5.200-3-6-6 0-.5.300-1 .9-1.300Z" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.500" y="3.500" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.200" cy="6.800" r="0.600" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M14 8.500h2.500V5H14c-2 0-3.500 1.500-3.500 3.500V11H8v3.500h2.500V21H14v-6.500h2.500L17 11h-3V8.800c0-.2.100-.3 0-.3Z" />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.500" width="18" height="13" rx="2.500" />
      <path d="m4 8 8 5.500L20 8" />
    </svg>
  );
}

export function MapPinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-6.500-5.700-6.500-11A6.500 6.500 0 0 1 18.500 10c0 5.300-6.500 11-6.500 11Z" />
      <circle cx="12" cy="10" r="2.300" />
    </svg>
  );
}

export function SuitcaseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="8" width="17" height="12" rx="2" />
      <path d="M9 8V6.2A1.2 1.2 0 0 1 10.2 5h3.6A1.2 1.2 0 0 1 15 6.2V8" />
    </svg>
  );
}

export function HotelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V7.2A1.2 1.2 0 0 1 5.2 6h13.6A1.2 1.2 0 0 1 20 7.2V20" />
      <path d="M3 20h18" />
      <path d="M10 20v-4.5h4V20" />
      <path d="M8 10h.8M12 10h.8M16 10h.8M8 13.5h.8M12 13.5h.8M16 13.5h.8" />
    </svg>
  );
}

export function PlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12 3.5 5.2l2.2 6.8-2.2 6.8L21 12Z" />
      <path d="M10.2 12H21" />
    </svg>
  );
}

export function TrainIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="3.5" width="14" height="13" rx="2.2" />
      <path d="M5 11.5h14" />
      <circle cx="8.5" cy="17.8" r="1.2" />
      <circle cx="15.5" cy="17.8" r="1.2" />
      <path d="M8 20.5h8" />
    </svg>
  );
}

export function BusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="11" rx="2.2" />
      <path d="M3.5 11h17" />
      <path d="M7 16v2.5M17 16v2.5" />
      <path d="M7 20.5h2.5M14.5 20.5H17" />
    </svg>
  );
}

export function CompassIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="m15 9-1.4 4.2L9.4 14.6 10.8 10.4 15 9Z" />
    </svg>
  );
}
