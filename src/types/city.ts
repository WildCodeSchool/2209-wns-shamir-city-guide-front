import { ICircuit } from "./circuit";
import { IPoi } from "./poi";
import { IUser } from "./user";

export interface ICity {
  id?: number;
  name: string;
  latitude: string;
  longitude: string;
  picture: string;
  // circuits?: ICircuit[];
  // pois?: IPoi[];
  user: IUser[];
}