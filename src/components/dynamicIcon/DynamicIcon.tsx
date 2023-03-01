import React from "react";
import * as icons from "@mui/icons-material";

export type IconProps = {
  iconName: keyof typeof icons; // Le nom de l'icône doit correspondre à une clé de l'objet d'icônes
  color: string
};


const DynamicIcon: React.FC<IconProps> = ({ iconName, color }: IconProps) => {
  const colorStyle = {
    stroke: color
  }
  
  const IconComponent = icons[iconName];
  return <IconComponent style={colorStyle} className="icon" />;
};

export default DynamicIcon;
