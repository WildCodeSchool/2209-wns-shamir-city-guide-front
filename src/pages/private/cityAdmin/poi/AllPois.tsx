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

import { IPoi } from "../../../../types/poi";
import { GetCitiesByUsername } from "../../../../services/city";
import { GetAllPois } from "../../../../services/poi";
import { GetAllTags } from "../../../../services/tag";
import { GetAllTypes } from "../../../../services/type";
import DynamicIcon from "../../../../components/dynamicIcon/DynamicIcon";

import CreatePoi from "../../../../components/poi/create/CreatePoi";
import UpdatePoi from "../../../../components/poi/update/UpdatePoi";

import Loader from "../../../../components/loader/Loader";
import ErrorModal from "../../../../components/modal/serverError/ServerErrorModal";
import UseFilteredSearch from "../../../../components/useFilteredSearch/UseFilteredSearch";
import { DefaultIconsNames } from "../../../../utils/constants";


const AllPois: React.FC = () => {
    // Accordion state
    const [expanded, setExpanded] = useState<string | false>(false);
    const [loading, setLoading] = useState(true);
    const [openErrorModal, setOpenErrorModal] = useState<boolean>(false);
    const handleModalClose = () => setOpenErrorModal(false);

    // User in store
    const userSelector = useAppSelector((state) => state.userReducer.user);
  
    // GET ALL
    const { citiesByUsername, citiesByUsernameError } = GetCitiesByUsername(userSelector.infos.username);
    const { allPois, poisError, poisLoading } = GetAllPois();
    const { allTags, tagsError } = GetAllTags();
    const { allTypes, typesError } = GetAllTypes();

    // Active categories Loader during 0.5 second
    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
            setExpanded(false);
        }, 600);
    }, [allPois]);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const resetExpanded = () => setExpanded(false);

    // Filtered search
    const [filteredPois, setFilteredPois] = useState<IPoi[]>();
    const handleFilteredPois = (pois: IPoi[]) => setFilteredPois(pois);

    useEffect(() => {
        if (allPois?.getAllPoi) {
            handleFilteredPois(allPois?.getAllPoi);
        } 
    }, [allPois?.getAllPoi]);
  
    if (poisError || citiesByUsernameError || typesError || tagsError) return <ErrorModal error={poisError} onModalClose={handleModalClose} />
  
    const ActiveLoaderPois: React.FC = () => (
    <div className="page all-tags">
        <div className="loader-all-items">
            <Loader styleClass="loader" />
            <DynamicIcon iconName={DefaultIconsNames.POI as keyof typeof icons} color='' />
            <h4>Chargement des points d'intérêt...</h4> 
        </div>
    </div> 
    )

    if (poisLoading) {
        return <ActiveLoaderPois/>
    }
    
    return (
        <div className="page all-tags" >
            {loading ? (
                <ActiveLoaderPois />
            ) : (
                    <div className="content">
                        <h2 className="page-title">Les points d'intérêt</h2>
                        <CreatePoi 
                            tags={allTags.getAllTags} 
                            types={allTypes.getAllTypes} 
                            userCities={citiesByUsername.getCitiesByUsername} 
                        />
                        <UseFilteredSearch 
                            dataToFilter={allPois.getAllPoi} 
                            searchKey="name"
                            searchKeyProperty="city"
                            setItems={handleFilteredPois} 
                        />
                        {filteredPois && filteredPois.map((poi: IPoi, index: number) => {
                            return (
                                <div className="tag-section" key={poi.id}>
                                    <Accordion expanded={expanded === "panel" + (index + 1)} onChange={handleChange("panel" + (index + 1))}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon className="icon-blue-light" />}
                                            aria-controls={`panel${index + 1}bh-content`}
                                        >
                                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                <DynamicIcon iconName={DefaultIconsNames.POI} color='' />
                                            </Typography>
                                            <Typography className='name-section-color' sx={{ color: 'text.secondary' }}>{poi.name}</Typography>
                                        </AccordionSummary>

                                        <AccordionDetails id={`section-${index}`}>
                                            <UpdatePoi 
                                                poi={poi} 
                                                tags={allTags.getAllTags} 
                                                types={allTypes.getAllTypes} 
                                                userCities={citiesByUsername.getCitiesByUsername} resetExpanded={resetExpanded} 
                                            />
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            )
                        })}
                        {openErrorModal && <ErrorModal error={poisError} onModalClose={handleModalClose} />}
                    </div>
                )
            }
        </div>
    )
}

export default AllPois;
