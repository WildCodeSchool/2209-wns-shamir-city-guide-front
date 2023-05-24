import React, { 
  ChangeEvent, 
  FormEvent, 
  useEffect, 
  useState
} from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_CIRCUIT } from "../../../api/circuit/mutations";
import { GET_ALL_CIRCUITS } from "../../../api/circuit/queries";

import PoisByCity from "../../poisByCity";
import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import CustomSelectMenu from "../../selectMenu";
import ImageLink from "../../imageLink";
import DeleteCircuit from "../delete";

import { useAppSelector } from "../../../features/store";

import { validateCommonId, validateIdsArray } from "../../../utils/validationForms/commonValidation";
import { validateName, validatePicture } from "../../../utils/validationForms/circuitValidation";

import {  
    TextField, 
    SelectChangeEvent, 
    Button 
} from "@mui/material";

import {
    textFielPropsStyle,
    labelTextFieldPropsStyle,
    formButtonStyle,
    disabledFormButtonStyle
} from "../../../style/customStyles";

import { circuitDefaultImgUrl, cityDefaultImgUrl } from "../../../utils/constants";
import { ICity } from "../../../types/city";
import { ICategory } from "../../../types/category";
import { IPoi } from "../../../types/poi";
import { ICircuit } from "../../../types/circuit";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";


type CircuitFormProps = {
  circuit: ICircuit
  categories: ICategory[],
  userCities: ICity[]
  resetExpanded: () => void
};

const UpdateCircuit: React.FC<CircuitFormProps> = ({ 
  circuit, 
  categories,
  userCities, resetExpanded
 }: CircuitFormProps) => {
  const [circuitId, setCircuitId] = useState<number | undefined>(circuit.id);
  const [circuitName, setCircuitName] = useState<string>(circuit.name);
  const [circuitDescription, setCircuitDescription] = useState<string>(circuit.description);
  const [circuitPicture, setCircuitPicture] = useState<string>(circuit.picture);
    
  const [selectedCity, setSelectedCity] = useState<number | undefined>(circuit.city?.id);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(circuit.category?.id);
  const [selectedPois, setSelectedPois] = useState<(number | undefined)[]>([]);
    
  const [nameError, setNameError] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [pictureError, setPictureError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [categoryError, setCategoryError] = useState<string>("");
  const [poisError, setPoisError] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const userSelector = useAppSelector((state) => state.userReducer.user);

  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  useEffect(() => {
    parseCircuitId(circuit.id);
    parseCircuitCityId(circuit.city?.id);
    parseCircuitCategoryId(circuit.category.id);
    initializePoisIdsArray(circuit?.pois);
}, [circuit]);

  // UPDATE
  const [UpdateCircuit, {error: updatedCircuitError}] = useMutation(
    UPDATE_CIRCUIT, {
    refetchQueries: [
        { query: GET_ALL_CIRCUITS }
    ],
    onCompleted() {
      setLoading(false);
      resetExpanded();
    },
    onError() {
      setOpenErrorModal(true);
      setLoading(false);
    },
});

const handleOnUpdate = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!isAnyInputError()) {
    setLoading(true);
    setTimeout(() => {
      UpdateCircuit(
        {
          variables: {
            circuit: {
              id: circuitId,
              name: circuitName,
              description: circuitDescription,
              picture: circuitPicture,
              cityId: selectedCity,
              categoryId: selectedCategory,
              pois: selectedPois
            }
          }
        }
      )
    }, 500)
    } else return;
  }

   /***** Form validation *****/
   const changeName = async (value: string) => {
    setCircuitName(value);
    const errorName = await validateName({ name: value });
    if (errorName) setNameError(errorName);
    else setNameError("");
  }

  const changeDescription = async (value: string) => {
    if (typeof value === "string") {
      setCircuitDescription(value);
      if (value.length < 50) {
        setDescriptionError("La description doit contenir au moins 50 caractères");
      } else setDescriptionError("");
    } else {
      setDescriptionError("La valeur doit être une chaîne de caractères");
    }
  }

  const changePicture = async (value: string) => {
    setCircuitPicture(value);
    const errorPicture = await validatePicture({ picture: value });

    if (errorPicture) setPictureError(errorPicture);
    else setPictureError("");
  }

  const handleSelectedCityChange = async (event: SelectChangeEvent<number>) => {
    const cityId = parseInt(event.target.value as string);
    setSelectedCity(cityId);

    const cityError = await validateCommonId({ id: cityId ? cityId : 0 }); 
    if (cityError) setCityError(cityError);
    else {
      setCityError("");
    } 
  };

  const handleSelectedCategoryChange = async (event: SelectChangeEvent<number>) => {
    const categoryId = parseInt(event.target.value as string);
    setSelectedCategory(categoryId);

    const categoryError = await validateCommonId({ id: categoryId ? categoryId : 0 });
    if (categoryError) setCategoryError(categoryError);
    else setCategoryError("");
  };

  const handleSelectedPoisChange = async (stringId: ChangeEvent<HTMLInputElement>) => {
    if (typeof stringId === "string") {
      const poiId = parseInt(stringId);

      if (selectedPois.includes(poiId)) {
        setSelectedPois(selectedPois.filter((id) => id !== poiId));
      } else {
        setSelectedPois([...selectedPois, poiId]);
      }
    }
    const poisArrayIsValid = await validateIdsArray(selectedPois);
    if (!poisArrayIsValid) setPoisError("Il y a un problème dans la sélection des points d'intérêt");
  };

  // Parse id functions
  const parseCircuitId = (circuitId: number | undefined) => {
    if (typeof circuitId === "string") setCircuitId(parseInt(circuitId));
  }

  const parseCircuitCityId = (cityId: number | undefined) => {
    if (typeof cityId === "string") setSelectedCity(parseInt(cityId));
  }

  const parseCircuitCategoryId = (categoryId: number | undefined) => {
    if (typeof categoryId === "string") setSelectedCategory(parseInt(categoryId));
  }

  const initializePoisIdsArray = (pois: IPoi[]) => {    
    if (pois?.length === 0 || !pois) setSelectedPois([]);
    else {
      const poisIdsArray = pois.map((poi: IPoi) => {
        return (typeof poi.id === "string") ? parseInt(poi.id) : undefined;
      });
      setSelectedPois(poisIdsArray);
    }
  }

  const isAnyInputError = () => (
    circuitName.length === 0 ||
    circuitDescription.length === 0 ||
    circuitPicture.length === 0 ||
    !selectedCity ||
    (
      selectedCity && 
      typeof selectedCity === "number" && 
      selectedCity === 0
    ) ||
    !selectedCategory ||
    (
      selectedCategory && 
      typeof selectedCategory === "number" && 
      selectedCategory === 0
    ) ||
    nameError ||
    descriptionError ||
    pictureError ||
    cityError ||
    categoryError ||
    poisError
  );

  const isAuthorizedToUpdate = () => userSelector.infos.id === Number(circuit.city?.user?.id);
  
  return (
    <div className="form_block">
      <div className="create-form">
        <form
          autoComplete="off"
          onSubmit={e => handleOnUpdate(e)}
        >
          <div className="fields">
            <TextField
              label="Nom"
              variant="filled"
              inputProps={{style: textFielPropsStyle}}
              InputLabelProps={{style: labelTextFieldPropsStyle}}
              onChange={(e) => changeName(e.target.value)}
              className='text-field'
              value={circuitName}
              error={nameError?.length ? true : false}
              helperText={nameError.length ? nameError : ""}
              disabled={!isAuthorizedToUpdate()}
            /> 
            
            <TextField
              label="Description"
              variant="filled"
              multiline
              rows={2}
              inputProps={{style: textFielPropsStyle}}
              InputLabelProps={{style: labelTextFieldPropsStyle}}
              onChange={(e) => changeDescription(e.target.value)}
              className='text-field'
              value={circuitDescription}
              error={descriptionError?.length ? true : false}
              helperText={descriptionError.length ? descriptionError : ""}
              disabled={!isAuthorizedToUpdate()}
            />

            <div className="container-select-image-checkbox">
              <div className="image-field_block">
                <TextField
                  label="Image"
                  variant="filled"
                  inputProps={{style: textFielPropsStyle}}
                  InputLabelProps={{style: labelTextFieldPropsStyle}}
                  onChange={(e) => changePicture(e.target.value)}
                  className='text-field'
                  value={circuitPicture}
                  error={pictureError?.length ? true : false}
                  helperText={pictureError.length ? pictureError : ""}
                  disabled={!isAuthorizedToUpdate()}
                />
                <div className="image_block">
                  <ImageLink link={circuitPicture} defaultPath={circuitDefaultImgUrl} 
                  alt="point d'intérêt" />
                </div>
              </div>

              {isAuthorizedToUpdate() ? (
                <div className="menu-select-block">
                  <div className="cities-select-menu">
                    <CustomSelectMenu
                      label="Ville"
                      menuSelectClassname="menu-select-cities"
                      selectValue={selectedCity ?? 0}
                      onChange={handleSelectedCityChange}
                      dataToList={userCities}
                      menuItemClassname=""
                      menuItemPropertyToDisplay="name"
                      displayImg={true}
                      propertyImgToDisplay='picture'
                    />
                    <p>{cityError.length ? cityError : ""}</p> 
                  </div>

                  <div className="categories-select-menu">
                    <CustomSelectMenu
                      label="Category"
                      menuSelectClassname="menu-select-category"
                      selectValue={selectedCategory ?? 0}
                      onChange={handleSelectedCategoryChange}
                      dataToList={categories}
                      menuItemClassname=""
                      menuItemPropertyToDisplay="name"
                      displayIcon={true}
                      propertyImgToDisplay='icon'
                    />
                    <p>{categoryError.length ? categoryError : ""}</p>
                  </div>
                </div>
              ): (
                <div className="ville-type-block">
                  <div className="selected-city">
                    <div className="libelle_block">
                      <p>Ville :</p>
                      <p>{circuit.city?.name}</p>
                    </div>
                    <div className="city-img_block">
                      <ImageLink link={circuit.city?.picture ? circuit.city.picture : ""} defaultPath={cityDefaultImgUrl} alt="point d'intérêt" />
                    </div>
                  </div>
                  <div className="selected-type">
                    <div className="libelle_block">
                      <p  className="libelle">Catégorie :</p>
                      <div className="name-logo">
                        <p>{circuit.category.name}</p>
                        <DynamicIcon iconName={circuit.category.icon} color={circuit.category.color} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <h4>Points d'intérêt</h4>
            {isAuthorizedToUpdate() ? (
              <PoisByCity 
                cityId={selectedCity ? selectedCity : 0} 
                selectedPois={ selectedPois}
                handleSelectedPois={handleSelectedPoisChange}
              />
            ) : (
              <div className="tags-list display-poi-list_block">
                {circuit.pois?.length ? (
                  <>
                    {circuit.pois.map((poi: IPoi) => {
                      return (
                        <div className="tag_block display-poi-item" key={poi.id}>
                            <p className="display-poi-libelle"> {poi.name} </p>
                            <div className="poi-img_block">
                              <ImageLink link={poi.picture} defaultPath={circuitDefaultImgUrl} alt='circuit-img' />
                            </div>
                        </div>
                      )
                    })}
                  </>    
                ): (
                    <p className="no-tag-msg">Ce circuit n'a plus de points d'intérêt qui lui sont associés</p>
                )}
              </div>
            )}
          </div>

          {isAuthorizedToUpdate() &&
            <div className='buttons'>
              <div className='update-btn-loading-block'>
                <Button
                  className='update-btn'
                  style={(!isAuthorizedToUpdate() || isAnyInputError()) ? disabledFormButtonStyle : formButtonStyle}
                  type="submit"
                  variant="contained"
                  disabled={(!isAuthorizedToUpdate() || isAnyInputError()) ? true : false}
                >
                  Mettre à jour
                </Button>
                {loading && <Loader styleClass='update-tag-loader' />}
              </div>
              <DeleteCircuit id={Number(circuit.id)} resetExpanded={resetExpanded} />
            </div>
          }
        </form>
      </div>
      {openErrorModal && <ErrorModal error={updatedCircuitError} onModalClose={handleModalClose} />}
    </div>
  )
}
export default UpdateCircuit;