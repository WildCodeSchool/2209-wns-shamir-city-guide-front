import * as icons from "@mui/icons-material";

export interface ICategory {
  id?: number;
  name: string;
  color: string;
  icon: keyof typeof icons;
}
