import './loader.scss';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

type LoaderProps = {
  styleClass: string
};

const Loader: React.FC<LoaderProps> = ({ styleClass }: LoaderProps) => {
  return (
    <Box sx={{ display: 'flex' }} id={`loader-${styleClass}`} >
      <CircularProgress className="loader" />
    </Box>
  );
}

export default Loader;