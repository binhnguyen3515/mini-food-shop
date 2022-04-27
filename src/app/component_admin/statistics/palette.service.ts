import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaletteService {

  getData(): DataItem[] {
    return new Array(20).fill(1).map((val, index) => ({
      arg: `Item${index}`,
      val,
    }));
  }

  getPaletteCollection(): string[] {
    return ['Material', 'Soft Pastel', 'Harmony Light', 'Pastel', 'Bright', 'Soft', 'Ocean', 'Office', 'Vintage', 'Violet', 'Carmine', 'Dark Moon', 'Soft Blue', 'Dark Violet', 'Green Mist'];
  }

  getPaletteExtensionModes(): string[] {
    return ['Alternate', 'Blend', 'Extrapolate'];
  }
}
export class DataItem {
  arg!: string;

  val!: number;
}