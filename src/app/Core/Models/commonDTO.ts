import {FaqDTO} from "./cityDTO";

export interface GetServiceRequestDTO {
  id: number
  name: string
}

export interface SettingDTO {
  address: string;
  consoleGoogle: string;
  description: string;
  descriptionFooter: string;
  email: string;
  favicon: string;
  location: string;
  mobileBanner: string;
  mobileBanner2: string;
  banner1: string;
  banner2: string;
  logo: string;
  faq: any
  logoFooter: string;
  isClose: boolean | string;
  metaTags: string;
  namads: string[];
  socialLinks: string;
  tel: string;
  title: string;
  whatsapp: string;
  // footerLinks: FooterLinks[];
  // thumbnail?: string;
}

export interface FooterLinks {
  title: string;
  slug: string;
  type: string;
}

export interface metaTagsDTO {
  name: string;
  value: string;
}

export interface transactionDTO {
  amount: number;
  bank_res: string;
  createdAt: string;
  id: string;
  resnumber: string;
  status: string;
  ref_code: string;
}

export interface UploadResDTO {
  id?: number | null;
  path: string;
  url: string;
  alt?: string;
  type?: number;
}

export interface newSettingDTO {
  siteDescription: string;
  siteTitle: string;
  separator: string;
  favicon: string;
  siteLogos: {
    light: string;
    dark: string;
    mobile_light: string;
    mobile_dark: string;
  },
  footer: {
    namad: any[];
    map: string;
    info: any[];
    description: string;
  },
  metas: any[];
  post_thumbnail: string;
  social_links: any[];
  filters: any[];
}
