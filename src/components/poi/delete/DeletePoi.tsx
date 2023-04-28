//import "./deleteCategory.scss";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { GET_ALL_POIS } from "../../../api/poi/queries";
import { DELETE_POI } from "../../../api/poi/mutations";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import Loader from "../../loader/Loader";


type PoiByIdProps = {
    id: number
    resetExpanded: () =>  void
};

const DeletePoi: React.FC<PoiByIdProps> = ({ id, resetExpanded }: PoiByIdProps) => {
    const [loading, setLoading] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
    const handleModalClose = () => setOpenErrorModal(false);

    // DELETE
    const [
        deletePoi, { 
            error: deletePoiError,  
        }
    ] = useMutation(DELETE_POI, {
            onCompleted() {
            setLoading(false);
        },
            refetchQueries: [
            { query: GET_ALL_POIS }
        ],
            onError() {
            setOpenErrorModal(true);
            setLoading(false);
        },
    });

    const handleOnDelete= (id: number) => {
        setLoading(true);
        setTimeout(() => {
            deletePoi({
            variables: { deletePoiId: id }, 
            })
            resetExpanded();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }, 500)
    }

    return (
        <div className="delete-block">
            {loading && <Loader styleClass='delete-tag-loader' />}
            <Button onClick={() => handleOnDelete(id)}>
                <DeleteIcon className="icon-delete"  />
            </Button>
            {openErrorModal && <ErrorModal error={deletePoiError} onModalClose={handleModalClose} />}
        </div>
    )
}

export default DeletePoi;
