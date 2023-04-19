export interface CityListRequestDTO {
  type: number | null;
  perPage: number;
  search: string | null;
  hasOriginTour:boolean
  hasDestTour:boolean
  city?: number | null;
  hasHotel: boolean;
}

export interface CitySetRequestDTO {
  name?: string;
  nameEn: string;
  country: string;
  faq: FaqDTO[];
  images: any[];
  imageSlider: any;
  description: string;
  meta_description: string;
  type?: boolean;
}

export interface FaqDTO {
  question: string;
  answer: string;
}

export interface CityResponseDTO {
  name: string;
  id: number;
  type: number | boolean
  image?: string
  slug: string
  slugEn: string
  faq: FaqDTO[]
  description?: string
  images?: string[]
  nameEn?: string
}


export interface MapCityResponseDTO {
  id: number;
  name: string;
  cities: CityDTO[];
}

export interface CityDTO {
  id: number;
  coordinates: number[];
  name: string;
}




