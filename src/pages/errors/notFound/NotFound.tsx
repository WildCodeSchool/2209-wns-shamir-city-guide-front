import './notFound.scss';
import SentimentDissatisfiedRoundedIcon from '@mui/icons-material/SentimentDissatisfiedRounded';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className='page not-found'>
      <div className='content'>
        <h3>Page introuvable</h3>
        <SentimentDissatisfiedRoundedIcon />
        <p>La ressource n'a pas été trouvée, servez-vous du globe pour revenir à la page d'accueil et à la navigation</p>
        <div className='globe-icon'>
          <Link to='/'>
            <img className='globe-draw-img' src="/images/globe-purple.png" alt="globe-purple_img" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound
