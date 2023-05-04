import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_POI } from "../../../api/poi/mutations";
import { GET_ALL_POIS } from "../../../api/poi/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import CustomSelectMenu from "../../selectMenu";
import CustomCheckboxList from "../../../components/checkBoxList";
import ImageLink from "../../imageLink";
import DeletePoi from '../delete/DeletePoi';

import { useAppSelector } from "../../../features/store";

import { validateCommonId, validateIdsArray } from "../../../utils/validationForms/commonValidation";
import { 
    validateName,
    validateAddress,
    validateLatitude,
    validateLongitude,
    validatePicture 
} from "../../../utils/validationForms/poiValidation";

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
import { poiDefaultImgUrl, cityDefaultImgUrl, Colors } from "../../../utils/constants";
import { ITag } from "../../../types/tag";
import { IType } from "../../../types/type";
import { IPoi } from "../../../types/poi";
import { ICity } from "../../../types/city";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";

type PoiFormProps = {
    poi: IPoi
    tags: ITag[]
    types: IType[]
    userCities: ICity[]
    resetExpanded: () => void
};


const UpdatePoi: React.FC<PoiFormProps> = ({ 
    poi, 
    tags, 
    types, 
    userCities,
    resetExpanded 
}: PoiFormProps) => {
    const [poiId, setPoiId] = useState<number | undefined>(poi.id);
    const [poiName, setPoiName] = useState<string>(poi.name);
    const [poiAddress, setPoiAddress] = useState<string>(poi.address);
    const [poiLatitude, setPoiLatitude] = useState<string>(poi.latitude);
    const [poiLongitude, setPoiLongitude] = useState<string>(poi.longitude);
    const [poiPicture, setPoiPicture] = useState<string>(poi.picture);

    const [selectedCity, setSelectedCity] = useState<number | undefined>(poi.city?.id);
    const [selectedType, setSelectedType] = useState<number | undefined>(poi.type?.id);
    const [selectedTags, setSelectedTags] = useState<(number | undefined)[]>([]);
    
    const [nameError, setNameError] = useState<string>("");
    const [addressError, setAddressError] = useState<string>("");
    const [latitudeError, setLatitudeError] = useState<string>("");
    const [longitudeError, setLongitudeError] = useState<string>("");
    const [pictureError, setPictureError] = useState<string>("");
    const [cityError, setCityError] = useState<string>("");
    const [typeError, setTypeError] = useState<string>("");
    const [tagsError, setTagsError] = useState<string>("");

    const [loading, setLoading] = useState(false);

    const userSelector = useAppSelector((state) => state.userReducer.user);

    const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
    const handleModalClose = () => setOpenErrorModal(false);

    useEffect(() => {
        parsePoiId(poi.id);
        parsePoiCityId(poi.city.id);
        parsePoiTypeId(poi.type.id);
        initializeTagsIdsArray(poi.tags);
    }, [poi]);

    // UPDATE
    const [
        updatePoi, {
        error: updatePoiError,
        }
    ] = useMutation(UPDATE_POI, {
        refetchQueries: [
        { query: GET_ALL_POIS }
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
                updatePoi({
                    variables: {
                        poi: {
                            id: poiId,
                            name: poiName,
                            address: poiAddress,
                            latitude: poiLatitude,
                            longitude: poiLongitude,
                            picture: poiPicture,
                            cityId: selectedCity,
                            typeId: selectedType,
                            tags: selectedTags
                        }
                    },
                });
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }, 500)
        } else return;
    }

    /***** Form validation *****/
    const changeName = async (value: string) => {
        setPoiName(value);
        const errorName = await validateName({ name: value });
        if (errorName) setNameError(errorName);
        else setNameError("");
    }

    const changeAddress = async (value: string) => {
        setPoiAddress(value);
        const errorAddress = await validateAddress({ address: value });
        if (errorAddress) setAddressError(errorAddress);
        else setAddressError("");
    }

    const changeLatitude = async (value: string) => {
        setPoiLatitude(value);
        const errorLatitude = await validateLatitude({ latitude: value });
        if (errorLatitude) setLatitudeError(errorLatitude);
        else setLatitudeError("");
    }

    const changeLongitude = async (value: string) => {
        setPoiLongitude(value);
        const errorLongitude = await validateLongitude({ longitude: value });
        if (errorLongitude) setLongitudeError(errorLongitude);
        else setLongitudeError("");
    }

    const changePicture = async (value: string) => {
        setPoiPicture(value);
        const errorPicture = await validatePicture({ picture: value });

        if (errorPicture) setPictureError(errorPicture);
        else setPictureError("");
    }

    const handleSelectedCityChange = async (event: SelectChangeEvent<number>) => {
        const cityId = parseInt(event.target.value as string);
        setSelectedCity(cityId);

        const cityError = await validateCommonId({ id: cityId ? cityId : 0 }); 
        if (cityError) setCityError(cityError);
        else setCityError("");
    };

    const handleSelectedTypeChange = async (event: SelectChangeEvent<number>) => {
        const typeId = parseInt(event.target.value as string);
        setSelectedType(typeId);

        const typeError = await validateCommonId({ id: typeId ? typeId : 0 });
        if (typeError) setTypeError(typeError);
        else setTypeError("");
    };

    const handleSelectedTags = async (stringId: ChangeEvent<HTMLInputElement>) => {
        if (typeof stringId === "string") {
            const tagId = parseInt(stringId);

            if (selectedTags.includes(tagId)) {
                setSelectedTags(selectedTags.filter((id) => id !== tagId));
            } else {
                setSelectedTags([...selectedTags, tagId]);
            }
        }

        const tagsArrayIsValid = await validateIdsArray(selectedTags); 
        if (!tagsArrayIsValid) setTagsError("Il y a un problème dans la sélection des tags");
    };

    // Parse id functions
    const parsePoiId = (poiId: number | undefined) => {
        if (typeof poiId === "string") setPoiId(parseInt(poiId));
    }

    const parsePoiCityId = (cityId: number | undefined) => {
        if (typeof cityId === "string") setSelectedCity(parseInt(cityId));
    }

    const parsePoiTypeId = (typeId: number | undefined) => {
        if (typeof typeId === "string") setSelectedType(parseInt(typeId));
    }

    const initializeTagsIdsArray = (tags: ITag[]) => {
        if (tags.length === 0) setSelectedTags([]);
        else {
            const tagsIdsArray = tags.map((tag: ITag) => {
                return (typeof tag.id === "string") ? parseInt(tag.id) : undefined;
            });
            setSelectedTags(tagsIdsArray)
        }
    }

    const isAnyInputError = () => (
        poiName.length === 0 ||
        poiAddress.length === 0 ||
        poiLatitude.length === 0 ||
        poiLongitude.length === 0 ||
        poiPicture.length === 0 ||
        !selectedCity ||
        (
            selectedCity && 
            typeof selectedCity === "number" && 
            selectedCity === 0
        ) ||
        !selectedType ||
        (
            selectedType && 
            typeof selectedType === "number" && 
            selectedType === 0
        ) ||
        nameError ||
        addressError ||
        latitudeError ||
        longitudeError ||
        pictureError ||
        cityError ||
        typeError ||
        tagsError
    );

    const isAuthorizedToUpdate = () => userSelector.infos.id === poi.city.user.id;
    
    return (
        <div className="form_block">
            <div className="create-form">
                <form
                    autoComplete="off"
                    onSubmit={e => handleOnUpdate(e)}
                >
                    <div className='fields'>
                        <TextField
                            label="Nom"
                            variant="filled"
                            inputProps={{style: textFielPropsStyle}}
                            InputLabelProps={{style: labelTextFieldPropsStyle}}
                            onChange={(e) => changeName(e.target.value)}
                            className='text-field'
                            value={poiName}
                            error={nameError?.length ? true : false}
                            helperText={nameError.length ? nameError : ""}
                            disabled={!isAuthorizedToUpdate()}
                        />
                        <TextField
                            label="Adresse"
                            variant="filled"
                            inputProps={{style: textFielPropsStyle}}
                            InputLabelProps={{style: labelTextFieldPropsStyle}}
                            onChange={(e) => changeAddress(e.target.value)}
                            className='text-field'
                            value={poiAddress}
                            error={addressError?.length ? true : false}
                            helperText={addressError.length ? addressError : ""}
                            disabled={!isAuthorizedToUpdate()}
                        />
                        <TextField
                            label="Latitude"
                            variant="filled"
                            inputProps={{style: textFielPropsStyle}}
                            InputLabelProps={{style: labelTextFieldPropsStyle}}
                            onChange={(e) => changeLatitude(e.target.value)}
                            className='text-field'
                            value={poiLatitude}
                            error={latitudeError?.length ? true : false}
                            helperText={latitudeError.length ? latitudeError : ""}
                            disabled={!isAuthorizedToUpdate()}
                        />
                        <TextField
                            label="Longitude"
                            variant="filled"
                            inputProps={{style: textFielPropsStyle}}
                            InputLabelProps={{style: labelTextFieldPropsStyle}}
                            onChange={(e) => changeLongitude(e.target.value)}
                            className='text-field'
                            value={poiLongitude}
                            error={longitudeError?.length ? true : false}
                            helperText={longitudeError.length ? longitudeError : ""}
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
                                    value={poiPicture}
                                    error={pictureError?.length ? true : false}
                                    helperText={pictureError.length ? pictureError : ""}
                                    disabled={!isAuthorizedToUpdate()}
                                />
                                <div className="image_block">
                                    <ImageLink link={poiPicture} defaultPath={poiDefaultImgUrl} alt="point d'intérêt" />
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
                                    <div className="types-select-menu">
                                        <CustomSelectMenu
                                            label="Type"
                                            menuSelectClassname="menu-select-types"
                                            selectValue={selectedType ?? 0}
                                            onChange={handleSelectedTypeChange}
                                            dataToList={types}
                                            menuItemClassname=""
                                            menuItemPropertyToDisplay="name"
                                            displayIcon={true}
                                            propertyImgToDisplay='logo'
                                        />
                                        <p>{typeError.length ? typeError : ""}</p> 
                                    </div>
                                </div>
                            ) : (
                                <div className="ville-type-block">
                                    <div className="selected-city">
                                        <div className="libelle_block">
                                            <p>Ville :</p>
                                            <p>{poi.city.name}</p>
                                        </div>
                                        <div className="city-img_block">
                                            <ImageLink link={poi.city.picture} defaultPath={cityDefaultImgUrl} alt="point d'intérêt" />
                                        </div>
                                    </div>
                                    <div className="selected-type">
                                        <div className="libelle_block">
                                            <p  className="libelle">Type :</p>
                                            <div className="name-logo">
                                                <p>{poi.type.name}</p>
                                                <DynamicIcon iconName={poi.type.logo} color={poi.type.color} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <h4>Tags</h4>
                    {isAuthorizedToUpdate() ? (
                        <>
                            <CustomCheckboxList
                                checkboxListClassname="checkbox-list"
                                onChange={handleSelectedTags}
                                idsArray={selectedTags}
                                dataToList={tags}
                                menuItemPropertyToDisplay="name"
                                displayImg={false}
                                propertyImgToDisplay="icon"
                                displayIcon={true}
                                iconColor={Colors.PURPLE}
                            />
                            <p className="ids-error-msg">{tagsError.length ? tagsError : ""}</p>
                        </>
                    ) : (
                        <div className="tags-list">
                            {poi.tags.length ? (
                                <>
                                    {poi.tags.map((tag: ITag) => {
                                        return (
                                            <div className="tag_block" key={tag.id}>
                                                <p> {tag.name} </p>
                                                <DynamicIcon iconName={tag.icon} color={Colors.PURPLE} />
                                            </div>
                                        )
                                    })}
                                </>
                                
                            ): (
                                <p className="no-tag-msg">Ce point d'intérêt n'a pas encore été tagué</p>
                            )}
                        </div>
                    )}

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
                            <DeletePoi id={Number(poi.id)} resetExpanded={resetExpanded} />
                        </div>
                    }
                </form>
            </div>
            {openErrorModal && <ErrorModal error={updatePoiError} onModalClose={handleModalClose} />}
        </div>
    )
}

export default UpdatePoi;
