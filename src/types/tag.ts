import * as icons from "@mui/icons-material";

export interface ITag {
  id?: number;
  name: string;
  icon: keyof typeof icons;
}
