//import './updateCategory.scss';
import { FormEvent, useState } from "react";
import { useMutation } from "@apollo/client";

import { UPDATE_POI } from "../../../api/poi/mutations";
import { GET_ALL_POIS } from "../../../api/poi/queries";

import Loader from "../../loader/Loader";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import DynamicIcon from "../../dynamicIcon/DynamicIcon";
import DeletePoi from '../delete/DeletePoi';

import { validateName } from "../../../utils/validationForms/poiValidation";
import { DefaultIconsNames } from "../../../utils/constants";

import { TextField } from "@mui/material";
import Button from '@mui/material/Button';
import { ColorPicker, useColor } from 'react-color-palette';

import {
    textFielPropsStyle,
    labelTextFieldPropsStyle,
    formButtonStyle,
    disabledFormButtonStyle
} from "../../../style/customStyles";
import { ITag } from "../../../types/tag";
import { IType } from "../../../types/type";
import { IPoi } from "../../../types/poi";

type PoiFormProps = {
    poi: IPoi
    tags: ITag[]
    types: IType[]
    resetExpanded: () => void
};


const UpdatePoi: React.FC<PoiFormProps> = ({ poi, tags, types, resetExpanded }: PoiFormProps) => {
    const [poiToUpdate, setPoiToUpdate] = useState<IPoi>({
        id: Number(poi.id),
        name: poi.name,
        address: poi.address,
        latitude: poi.latitude,
        longitude: poi.longitude,
        picture: poi.picture
    });

    const [loading, setLoading] = useState(false);

    const [nameError, setNameError] = useState<string>("");

    const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
    const handleModalClose = () => setOpenErrorModal(false);

    // UPDATE
    const [
        updatePoi, {
        error: updatePoiError,
        }
    ] = useMutation(UPDATE_POI, {
        refetchQueries: [
        { query: GET_ALL_POIS }
        ],
        onCompleted(data) {
            setLoading(false);
            const updatedPoi = data.updatePoi;
            setPoiToUpdate({
                id: Number(updatedPoi.id),
                name: updatedPoi.name,
                address: updatedPoi.address,
                latitude: updatedPoi.latitude,
                longitude: updatedPoi.longitude,
                picture: updatedPoi.picture
            });

            resetExpanded();
        },
            onError() {
            setOpenErrorModal(true);
            setLoading(false);
        },
    });

    const handleOnUpdate = async (e: FormEvent<HTMLFormElement>, poiToUpdate: IPoi) => {
        e.preventDefault();
        const errorName = await validateName({ name: poiToUpdate.name });

        if (errorName) setNameError(errorName);
        if (!errorName) {
            setLoading(true);
            setTimeout(() => {
                updatePoi({
                    variables: {
                        poi: {
                            id: poiToUpdate.id,
                            name: poiToUpdate.name,
                            address: poiToUpdate.address,
                            latitude: poiToUpdate.latitude,
                            longitude: poiToUpdate.longitude,
                            picture: poiToUpdate.picture
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

    const changeName = async (value: string) => {
        setPoiToUpdate({...poiToUpdate, name: value});
        const errorName = await validateName({ name: value });
        if (errorName) setNameError(errorName);
        else setNameError("");
    }

    return (
        <div className="update-form">
            <form
            autoComplete="off"
                onSubmit={e => handleOnUpdate(e, poiToUpdate)}
            >
                <div className='fields'>
                    <TextField
                        label="Nom"
                        variant="filled"
                        inputProps={{style: textFielPropsStyle}}
                        InputLabelProps={{style: labelTextFieldPropsStyle}}
                        onChange={(e) => changeName(e.target.value.trim())}
                        className='text-field'
                        value={poiToUpdate.name}
                        error={nameError?.length ? true : false}
                        helperText={nameError.length ? nameError : ""}
                    />
                </div>

                <div className='buttons'>
                    <div className='update-btn-loading-block'>
                        <Button
                            className='update-btn'
                            style={(nameError) ? disabledFormButtonStyle : formButtonStyle}
                            type="submit"
                            variant="contained"
                            disabled={(nameError) ? true : false}
                        >
                            Mettre à jour
                        </Button>
                        {loading && <Loader styleClass='update-tag-loader' />}
                    </div>
                    <DeletePoi id={Number(poi.id)} resetExpanded={resetExpanded} />
                </div>
            </form>
            {openErrorModal && <ErrorModal error={updatePoiError} onModalClose={handleModalClose} />}
        </div>
    )
}

export default UpdatePoi;
