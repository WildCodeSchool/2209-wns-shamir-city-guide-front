import * as icons from "@mui/icons-material";

export interface IType {
  id?: number;
  name: string;
  logo: keyof typeof icons;
  color: string;
}
