import { 
  FormControl,
  MenuItem, 
  Select, 
  InputLabel,
  Avatar,
  Box,
  SelectChangeEvent
} from "@mui/material";

import DynamicIcon from '../dynamicIcon/DynamicIcon';

export const StyleAvatar = {
  padding: '0px',
  width: '100px',
  height: '60px',
  marginRight: '32px',
  borderRadius: 5
}

interface SelectMenuProps <T> {
  label: string
  menuSelectClassname: string
  selectValue: number
  onChange: (event: SelectChangeEvent<number>) => void
  dataToList: T[]
  menuItemClassname: string
  menuItemPropertyToDisplay: string
  displayImg?: boolean
  propertyImgToDisplay: string | null
  displayIcon?: boolean
}


function CustomSelectMenu<T>(props: SelectMenuProps<T>) {
  const { 
    label,
    menuSelectClassname, 
    selectValue, 
    onChange,
    dataToList,
    menuItemClassname,
    menuItemPropertyToDisplay,
    displayImg,
    propertyImgToDisplay,
    displayIcon
  } = props;

  return (
    <FormControl sx={{width:220}} className={menuSelectClassname}>
      <InputLabel id="custom-select-label"> {label} </InputLabel>
      <Select value={selectValue || ''} onChange={onChange}>
        {dataToList.map((item: any) => (
          <MenuItem
            key={item.id}
            value={item.id}
            className={menuItemClassname}
          > 
            <Box component="span" display="flex" alignItems="center">
              {displayImg && propertyImgToDisplay &&
                <Avatar
                  alt={`${item[menuItemPropertyToDisplay]}-img-alt`}
                  src={item[propertyImgToDisplay]}
                  style={StyleAvatar}
                />
              }
              {displayIcon && propertyImgToDisplay &&
                <DynamicIcon iconName={item[propertyImgToDisplay]} color={item?.color ? item.color : ''} />
              }
              <Box component="span">{item[menuItemPropertyToDisplay]}</Box>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelectMenu;
