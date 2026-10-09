import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  ...props,
});

export const WhatsAppIcon = (props: IconProps) => (
  <svg {...base({ ...props, fill: "currentColor", stroke: "none" })}>
    <path d="M12.04 2a9.9 9.9 0 0 0-8.47 15.03L2 22l5.1-1.34A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.34-2 1.4-.52.06-1.18.09-1.9-.12a17.2 17.2 0 0 1-1.72-.64c-3.03-1.31-5-4.37-5.15-4.57-.15-.2-1.23-1.64-1.23-3.13s.78-2.22 1.06-2.52c.27-.3.6-.37.8-.37h.58c.19 0 .43-.07.67.5.25.6.84 2.06.91 2.2.07.15.12.33.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.78 1.28 1.67 2.07 1.15 1.02 2.12 1.34 2.42 1.49.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.72.81 2.02.96.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
  </svg>
);

export const ArrowIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const ArrowDownIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </svg>
);

export const InstagramIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const PinIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const PhoneIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

export const CheckIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const ShovelIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M14 3l7 7M16.5 5.5 9 13M9 13l-4.2 4.2a2 2 0 0 0 0 2.8l.2.2a2 2 0 0 0 2.8 0L12 16" />
    <path d="M18 3l3 3" />
  </svg>
);

export const LayersIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 13 9 5 9-5" />
    <path d="m3 17.5 9 5 9-5" opacity="0" />
  </svg>
);

export const HammerIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="m14 6 4 4M4 20l9-9M12 4l3-1 6 6-1 3-3-1-7-7Z" />
  </svg>
);

export const LeafIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" />
    <path d="M5 19c3-5 6-8 10-10" />
  </svg>
);

export const TruckIcon = (props: IconProps) => (
  <svg {...base(props)}>
    <path d="M2 16V6h11v10M13 9h4l4 4v3h-3" />
    <circle cx="7" cy="17.5" r="2" />
    <circle cx="17" cy="17.5" r="2" />
  </svg>
);
