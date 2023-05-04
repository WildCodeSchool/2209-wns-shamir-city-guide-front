import { useState } from "react";
import { useMutation } from "@apollo/client";
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import { GET_ALL_CIRCUITS } from "../../../api/circuit/queries";
import { DELETE_CIRCUIT } from "../../../api/circuit/mutations";
import ErrorModal from "../../modal/serverError/ServerErrorModal";
import Loader from "../../loader/Loader";


type CircuitByIdProps = {
    id: number
    resetExpanded: () => void
};

const DeleteCircuit: React.FC<CircuitByIdProps> = ({ id, resetExpanded }: CircuitByIdProps) => {
    const [loading, setLoading] = useState(false);
    const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
    const handleModalClose = () => setOpenErrorModal(false);

    // DELETE
    const [
        deleteCircuit, { 
            error: deleteCircuitError,  
        }
    ] = useMutation(DELETE_CIRCUIT, {
            onCompleted() {
            setLoading(false);
        },
            refetchQueries: [
            { query: GET_ALL_CIRCUITS }
        ],
            onError() {
            setOpenErrorModal(true);
            setLoading(false);
        },
    });

    const handleOnDelete= (id: number) => {
        setLoading(true);
        setTimeout(() => {
          deleteCircuit({
            variables: { deleteCircuitId: id }, 
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
            {openErrorModal && <ErrorModal error={deleteCircuitError} onModalClose={handleModalClose} />}
        </div>
    )
}

export default DeleteCircuit;
