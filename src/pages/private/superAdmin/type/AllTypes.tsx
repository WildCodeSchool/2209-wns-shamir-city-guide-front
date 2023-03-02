import './allTypes.scss';
import React, { useState, useEffect } from "react";

import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as icons from "@mui/icons-material";

import { IType } from "../../../../types/type";
import { GetAllTypes } from "../../../../services/type";

import CreateType from "../../../../components/type/create/CreateType";
import UpdateType from "../../../../components/type/update/UpdateType";

import Loader from "../../../../components/loader/Loader";
import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";

import { DefaultIconsNames } from "../../../../utils/constants";

const AllTypes = () => {
  // Accordion state
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);
  
  // GET ALL
  const { allTypes, typesError, typesLoading } = GetAllTypes();

  // Active types Loader during 0.5 second
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setExpanded(false);
    }, 600);
  }, [allTypes]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
  };

  const resetExpanded = () => setExpanded(false);

  // Filtered search
  const [filteredTypes, setFilteredTypes] = useState<IType[]>();
  const handleFilteredTypes = (types: IType[]) => {
    setFilteredTypes(types);
  } 

  useEffect(() => {
    if (allTypes?.getAllTypes) {
      handleFilteredTypes(allTypes?.getAllTypes);
    } 
  }, [allTypes?.getAllTypes]);
  
  if (typesError) return <ErrorModal error={typesError} onModalClose={handleModalClose} />

  const ActiveLoaderTypes: React.FC = () => (
    <div className="page all-types">
      <div className="loader-all-items">
        <Loader styleClass="loader" />
        <DynamicIcon iconName={DefaultIconsNames.TYPE as keyof typeof icons} color='' />
        <h4>Chargement des types...</h4> 
      </div>
    </div> 
  )

  if (typesLoading) {
     return <ActiveLoaderTypes />
  }

  return (
    <div className="page all-types" >
      {loading ? (
        <ActiveLoaderTypes />
      ) : (
        <div className="content">
          <div className="infos">
            <p><span>*</span>Le logo <DynamicIcon color='' iconName={DefaultIconsNames.TYPE} />est utilisé par défaut lors de la création si le logo a déjà été choisie pour un autre tag présent dans la liste ou que le logo validé n'existe pas dans la liste des icônes diponibles.</p>
          </div>
          <CreateType icons={icons} />
          <UseFilteredSearch dataToFilter={allTypes.getAllTypes} searchKey={"name"} setItems={handleFilteredTypes} />
          {
            filteredTypes && 
            filteredTypes.map(
              (type: IType, index: number) => {
                return (
                  <div className="type-section" key={type.id}>
                    <Accordion expanded={expanded === "panel" + (index + 1)} onChange={handleChange("panel" + (index + 1))}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon className="icon-blue-light" />}
                        aria-controls={`panel${index + 1}bh-content`}
                      >
                      <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        <DynamicIcon iconName={type.logo} color={type.color} />
                      </Typography>
                      <Typography sx={{ color: 'text.secondary' }}>{type.name}</Typography>
                      </AccordionSummary>
                      <AccordionDetails id={`section-${index}`}>
                        <UpdateType type={type} icons={icons} resetExpanded={resetExpanded} />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                )
              }
            )
          }
          {openErrorModal && <ErrorModal error={typesError} onModalClose={handleModalClose} />}
        </div>
      )}
    </div>
  )
}

export default AllTypes;
