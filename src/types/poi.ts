import { IType } from "./type";
import { ICity } from "./city";
import { ITag } from "./tag";

export interface IPoi {
  id?: number;
  name: string;
  address: string;
  latitude: string;
  longitude: string
  picture: string;
  city: ICity;
  type: IType;
  tags: ITag[];
}
