
export interface WordData {
  original: string;
  opposite: string;
  similar: string;
}

export interface ImageData {
  original: string | null;
  opposite: string | null;
  similar: string | null;
}

export enum CardType {
  Original = "Original Word",
  Opposite = "Opposite Word",
  Similar = "Similar Word",
}
