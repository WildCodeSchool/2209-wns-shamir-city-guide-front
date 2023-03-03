import './useFilteredSearch.scss';
import React, { useState, useEffect } from 'react';
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { textFielPropsStyle } from '../../style/customStyles';

export interface IProps {
  dataToFilter: any[] | undefined;
  searchKey: string;
  setItems: (data: any[]) => void;
}


const UseFilteredSearch = ({ dataToFilter, searchKey, setItems }: IProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const placeholderTodisplay = (): string => {
    if (searchKey === "name" || "username") return "nom";
    else return "";
  }
  
  const handleSearchTermChange = (value: string) => setSearchTerm(value.toLowerCase());
  
  const handleSearchChange = () => {
    if (searchKey.length > 0 && dataToFilter) {
      const filteredData = dataToFilter.filter((item: any) => item[searchKey].toLowerCase().includes(searchTerm));
      setItems(filteredData);
    } else {
      if (dataToFilter) setItems(dataToFilter);
    }
  };

  useEffect(() => {    
    handleSearchChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    handleSearchTermChange("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // if dataToFilter change so it does mean that the tags has been reload so we have to reset the searchTerme field
  }, [dataToFilter]);

  return (
    <TextField
      className='filtered-search'
      variant="filled"
      inputProps={{style: textFielPropsStyle}}
      value={searchTerm}
      onChange={(e) => handleSearchTermChange(e.target?.value)}
      placeholder={`Rechercher par ${placeholderTodisplay()}`}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <SearchIcon className='icon search-icon' />
          </InputAdornment>
        ),
      }}
    />
  );
}

export default UseFilteredSearch;