import * as yup from "yup";

interface INameData {
  name: string;
}

interface IAddressData {
  address: string;
}

interface ILatitudeData {
  latitude: string;
}

interface ILongitudeData {
  longitude: string;
}

interface IPictureData {
  picture: string;
}

const nameValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Le nom est requis")
    .max(255, "Le nom ne peut pas faire plus de 255 caractères")
});

const addressValidationSchema = yup.object().shape({
  address: yup
    .string()
    .required("L'adresse est requise")
});

const latitudeValidationSchema = yup.object().shape({
  latitude: yup
    .string()
    .matches(/^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?)$/, "La latitude n'est pas dans le bon format")
});

const longitudeValidationSchema = yup.object().shape({
  longitude: yup
    .string()
    .matches(/^-?([0-9]{1,2}|1[0-7][0-9]|180)(\.[0-9]{1,})$/, "La longitude n'est pas dans le bon format")
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

export const validateAddress = async (address: IAddressData) => {
  try {
    await addressValidationSchema.validate(address);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};

export const validateLatitude = async (latitude: ILatitudeData) => {
  try {
    await latitudeValidationSchema.validate(latitude);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};

export const validateLongitude = async (longitude: ILongitudeData) => {
  try {
    await longitudeValidationSchema.validate(longitude);
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