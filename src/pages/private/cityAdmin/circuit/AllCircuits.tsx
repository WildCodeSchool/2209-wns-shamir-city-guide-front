import "../../superAdmin/tag/allTags.scss";
import { useState, useEffect } from "react";

// Redux, store
import { useAppSelector } from "../../../../features/store";

//Material UI Icons
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as icons from "@mui/icons-material";

import { GetAllCircuits } from "../../../../services/circuit";
import { GetCitiesByUsername } from "../../../../services/city";
import { GetAllCategories } from "../../../../services/category";
import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";

import CreateCircuit from "../../../../components/circuit/create";
import UpdateCircuit from "../../../../components/circuit/update";

import Loader from "../../../../components/loader/Loader";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";
import { DefaultIconsNames } from "../../../../utils/constants";
import { ICircuit } from "../../../../types/circuit";


const AllCircuits: React.FC = () => {
  // Accordion state
  const [expanded, setExpanded] = useState<string | false>(false);
  const [loading, setLoading] = useState(true);
  const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
  const handleModalClose = () => setOpenErrorModal(false);

  // User in store
  const userSelector = useAppSelector((state) => state.userReducer.user);

  // GET ALL
  const { allCircuits, circuitsError, circuitsLoading } = GetAllCircuits();
  const { citiesByUsername, citiesByUsernameError } = GetCitiesByUsername(userSelector.infos.username);
  const { allCategories, categoriesError } = GetAllCategories();

  // Active categories Loader during 0.5 second
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      setExpanded(false);
    }, 600);
  }, [allCircuits]);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const resetExpanded = () => setExpanded(false);

  // Filtered search
  const [filteredCircuits, setFilteredCircuits] = useState<ICircuit[]>();
  const handleFilteredCircuits = (circuits: ICircuit[]) => setFilteredCircuits(circuits);

  useEffect(() => {
    if (allCircuits?.getAllCircuits) {
      handleFilteredCircuits(allCircuits?.getAllCircuits);
    } 
  }, [allCircuits?.getAllCircuits]);

  if (circuitsError || citiesByUsernameError || categoriesError) return <ErrorModal error={circuitsError} onModalClose={handleModalClose} />

  const ActiveLoaderCircuits: React.FC = () => (
    <div className="page all-tags">
        <div className="loader-all-items">
            <Loader styleClass="loader" />
            <DynamicIcon iconName={DefaultIconsNames.CIRCUIT as keyof typeof icons} color='' />
            <h4>Chargement des circuits...</h4> 
        </div>
    </div> 
  )

    if (circuitsLoading) {
        return <ActiveLoaderCircuits/>
    }

  return (
    <div className="page all-tags" >
      {loading ? (
          <ActiveLoaderCircuits />
      ) : (
          <div className="content">
            <h2 className="page-title">Les circuits</h2>
            <CreateCircuit
              categories={allCategories.getAllCategories} 
              userCities={citiesByUsername.getCitiesByUsername} 
            />
            <UseFilteredSearch 
              dataToFilter={allCircuits?.getAllCircuits} 
              searchKey="name"
              searchKeyProperty="city"
              setItems={handleFilteredCircuits} 
            />
              {filteredCircuits && filteredCircuits.map((circuit: ICircuit, index: number) => {
                return (
                  <div className="tag-section" key={circuit.id}>
                    <Accordion expanded={expanded === "panel" + (index + 1)} onChange={handleChange("panel" + (index + 1))}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon className="icon-blue-light" />}
                        aria-controls={`panel${index + 1}bh-content`}
                      >
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                          <DynamicIcon iconName={DefaultIconsNames.CIRCUIT} color='' />
                        </Typography>
                        <Typography className='name-section-color' sx={{ color: 'text.secondary' }}>{circuit.name}</Typography>
                      </AccordionSummary>

                      <AccordionDetails id={`section-${index}`}>
                        <UpdateCircuit 
                          circuit={circuit} 
                          categories={allCategories.getAllCategories}
                          userCities={citiesByUsername.getCitiesByUsername} 
                          resetExpanded={resetExpanded} 
                        />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                )
              })}
              {openErrorModal && <ErrorModal error={circuitsError} onModalClose={handleModalClose} />}
          </div>
        )
      }
    </div>
  )
}

export default AllCircuits;
