import * as yup from "yup";

interface INameData {
  name: string;
}

interface IIconData {
  icon: string;
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
