import * as yup from "yup";

interface INameData {
  name: string;
}

interface IIconData {
  icon: string;
}

interface IColorData {
  color: string;
}


export const nameValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Le nom est requis")
    .max(255, "Le nom ne peut pas faire plus de 255 caractères")
});

export const iconValidationSchema = yup.object().shape({
  icon: yup
    .string()
    .required("L'icône est requis")
    .max(255, "Le nom de l'icône ne peut pas faire plus de 255 caractères")
});

export const colorValidationSchema = yup.object().shape({
  color: yup
    .string()
    .required("La couleur est requise")
    .max(255, "Le nom de la couleur ne peut pas faire plus de 255 caractères")
});


export const validateName = async (name: INameData) => {
  try {
    await nameValidationSchema.validate(name);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};

export const validateIcon = async (icon: IIconData) => {
  try {
    await iconValidationSchema.validate(icon);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};

export const validateColor = async (color: IColorData) => {
  try {
    await colorValidationSchema.validate(color);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};
