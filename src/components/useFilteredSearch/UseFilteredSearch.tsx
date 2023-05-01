import './style.scss';
import { useState, useEffect } from 'react';
import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { textFielPropsStyle } from '../../style/customStyles';

export interface IProps {
  dataToFilter: any[] | undefined
  searchKey?: string
  searchKeyProperty?: string
  setItems: (data: any[]) => void
}


const UseFilteredSearch = ({ 
  dataToFilter, 
  searchKey, 
  searchKeyProperty, 
  setItems
}: IProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const placeholderTodisplay = (): string => {
    let sentence = "";
    if (searchKey === "name" || "username") sentence += "nom";
    if (searchKeyProperty && searchKeyProperty === "city") sentence += " ou par ville"
    
    return sentence;
  }
  
  const handleSearchTermChange = (value: string) => setSearchTerm(value.toLowerCase());
  
  const handleSearchChange = () => {
    if (
      searchKey && 
      searchKey.length > 0 && 
      dataToFilter
    ) {
      const filteredData = dataToFilter.filter((item: any) => {
        if (
          searchKeyProperty &&
          (
            item[searchKey].toLowerCase().includes(searchTerm) ||
            item[searchKeyProperty].name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        ) return true; 
        else if (item[searchKey].toLowerCase().includes(searchTerm)) return true;
      });
      setItems(filteredData);
    } else {
      if (dataToFilter) setItems(dataToFilter);
    }
  };

  useEffect(() => {    
    handleSearchChange();
  }, [searchTerm]);

  useEffect(() => {
    handleSearchTermChange("");
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