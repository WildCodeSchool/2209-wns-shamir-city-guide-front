import * as yup from "yup";

interface INameData {
  name: string;
}

interface ILogoData {
  logo: string;
}


export const nameValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Le nom est requis")
    .max(255, "Le nom est trop long")
});

export const logoValidationSchema = yup.object().shape({
  logo: yup
    .string()
    .required("Le logo est requis")
    .max(255, "Le nom du logo est trop long")
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

export const validateLogo = async (logo: ILogoData) => {
  try {
    await logoValidationSchema.validate(logo);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};
