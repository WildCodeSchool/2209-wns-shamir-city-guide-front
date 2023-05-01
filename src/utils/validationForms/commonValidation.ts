import * as yup from "yup";

interface IIdData {
  id: number | undefined;
}

const idValidationSchema = yup.object().shape({
  id: yup
    .number()
    .min(1, "Choix obligatoire")
});


export const validateCommonId = async (id: IIdData) => {
  try {
    await idValidationSchema.validate(id);
  } catch (e) {
    if (e instanceof Error) {
      return e.message;
    } 
  }
};

export const validateIdsArray = async (idsArray: (number | undefined)[]): Promise<boolean> => {
  const uniqueBoxes = new Set(idsArray);
  if (uniqueBoxes.size !== idsArray.length) {
    return false;
  }
  return idsArray.every((boxe: number | undefined) => typeof boxe === 'number' && boxe >= 1);
};