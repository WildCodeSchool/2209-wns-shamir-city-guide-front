import { ICategory } from "./category";
import { ICity } from "./city";
import { IPoi } from "./poi";

export interface ICircuit {
  id?: number;
  name: string;
  picture: string;
  description: string;
  price: number;
  city?: ICity;
  category: ICategory;
  pois: IPoi[];
}
