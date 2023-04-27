import * as yup from "yup";
import { IUser } from "../../types/user";

type CityFormProps = {
  users: IUser[]
};

interface INameData {
  name: string;
}

interface IPictureData {
  picture: string;
}

interface ILatitudeData {
  latitude: string;
}

interface ILongitudeData {
  longitude: string;
}

interface IAdministrateurData {
  administrateur: object;
}

export const nameValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Le nom est requis")
    .max(255, "Le nom est trop long")
});

export const pictureValidationSchema = yup.object().shape({
  picture: yup
    .string()
    .matches(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "L'url de l'image n'est pas dans le bon format")
});

export const latitudeValidationSchema = yup.object().shape({
  latitude: yup
    .string()
    .matches(/^-?([0-8]?[0-9]|90)(\.[0-9]{1,})$/, "La latitude n'est pas dans le bon format")
});

export const longitudeValidationSchema = yup.object().shape({
  longitude: yup
    .string()
    .matches(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,})$/, "La longitude n'est pas dans le bon format")
});

export const administrateurValidationSchema = yup.object().shape({
  administrateur: yup
    // .oneOf()
    .string()
    .required("L'administrateur est requis")
})


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
    if(e instanceof Error) {
      return e.message;
    }
  }
};

export const validateLatitude = async (latitude: ILatitudeData) => {
  try {
    await latitudeValidationSchema.validate(latitude);
  } catch (e) {
    if(e instanceof Error) {
      return e.message;
    }
  }
};

export const validateLongitude = async (longitude: ILongitudeData) => {
  try {
    await longitudeValidationSchema.validate(longitude);
  } catch (e) {
    if(e instanceof Error) {
      return e.message;
    }
  }
};

export const validateAdministrateur = async (administrateur : IAdministrateurData) => {
  try {
    await administrateurValidationSchema.validate(administrateur);
  } catch(e) {
    if(e instanceof Error) {
      return e.message;
    }
  }
}
