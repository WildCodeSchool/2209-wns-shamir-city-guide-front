import './home.scss';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

import { formButtonStyle } from "../../../style/customStyles";


const Home: React.FC = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => navigate('/login');

  return (
    <div className='page home'>
      <div className='home-banner'>
        <img className='home-img' src="/images/background_home.jpg" alt="home_img" />
      </div>
      <div className='home-content'>
        <div className='content'>
          <img className='city-draw-img' src="/images/city-purple.png" alt="city-purple_img" />
          <h1>City Guid</h1>
          <p>Un site cartographique interactif qui permet aux utilisateurs de voir les points d'intérêt d'une ville et de suivre des itinéraires spécifiques à leurs envies</p>
          <Button  
            style={formButtonStyle} 
            variant="contained"
            onClick={navigateToLogin}
          >
            Se connecter
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home;
