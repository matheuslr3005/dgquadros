export type Contact = {
  id: "danilo" | "jr";
  name: string;
  phoneLabel: string;
  whatsappNumber: string;
};

export const CONTACTS: readonly [Contact, Contact] = [
  { id: "danilo", name: "Danilo", phoneLabel: "(51) 99952-1037", whatsappNumber: "5551999521037" },
  { id: "jr", name: "Jr.", phoneLabel: "(51) 99805-0999", whatsappNumber: "5551998050999" },
];

export const COMPANY = {
  name: "D.G. de Quadros",
  tagline: "Terraplanagem e Transportes",
  address: "Rua Rodrigues Alves, 218",
  neighborhood: "Niterói",
  city: "Canoas · RS",
  instagramHandle: "dgdequadros",
  instagramUrl: "https://instagram.com/dgdequadros",
  site: "dgdequadros.com.br",
} as const;

export const CREDIT = {
  name: "Lax",
  instagramUrl: "https://www.instagram.com/laxassessoria/",
} as const;

export const buildWhatsAppUrl = (whatsappNumber: string, message: string): string =>
  `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

export const DEFAULT_MESSAGE = "Olá! Vim pelo site da D.G. de Quadros e gostaria de pedir um orçamento.";

export const [PRIMARY_CONTACT] = CONTACTS;
export const primaryWhatsAppUrl = (message: string = DEFAULT_MESSAGE): string =>
  buildWhatsAppUrl(PRIMARY_CONTACT.whatsappNumber, message);
