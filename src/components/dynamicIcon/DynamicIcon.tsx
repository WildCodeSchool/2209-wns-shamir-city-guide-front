import React from "react";
import * as icons from "@mui/icons-material";

export type IconProps = {
  iconName: keyof typeof icons; // Le nom de l'icône doit correspondre à une clé de l'objet d'icônes
};


const DynamicIcon: React.FC<IconProps> = ({ iconName }: IconProps) => {
  const IconComponent = icons[iconName];
  console.log(iconName);
  return <IconComponent className="icon" />;
};

export default DynamicIcon;
