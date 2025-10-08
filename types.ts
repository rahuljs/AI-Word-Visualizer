export enum IndianLanguage {
  Marathi = "Marathi",
  Hindi = "Hindi",
  Telugu = "Telugu",
  Tamil = "Tamil",
  Kannada = "Kannada",
  Bengali = "Bengali",
  Gujarati = "Gujarati",
}

export interface WordData {
  original: string;
  opposite: string;
  similar: string;
  genZ: string;
  translation: string;
  pronunciation: string;
}

export interface ImageData {
  original: string | null;
  opposite: string | null;
  similar: string | null;
  genZ: string | null;
}

export enum CardType {
  Original = "Original Word",
  Opposite = "Opposite Word",
  Similar = "Similar Word",
  GenZ = "Gen-Z Slang",
}
