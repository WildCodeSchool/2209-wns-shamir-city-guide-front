import * as yup from "yup";

interface INameData {
  name: string;
}

interface IPictureData {
  picture: string
}

export const nameValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Le nom est requis")
    .max(255, "Le nom ne peut pas faire plus de 255 caractères")
});

const pictureValidationSchema = yup.object().shape({
  picture: yup
    .string()
    .matches(/^(http(s):\/\/.)[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/ , "L'url de l'image n'est pas dans le bon format")
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

export const validatePicture = async (picture: IPictureData) => {
  try {
    await pictureValidationSchema.validate(picture);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};

