import './notAllowed.scss';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import MoodBadRoundedIcon from '@mui/icons-material/MoodBadRounded';


const NotAllowed: React.FC = () => {
  return (
    <div className='page not-allowed'>
      <div className='content'>
        <h3>Page non autorisée</h3>
        <div className='not-allowed-icons'>
          <BlockRoundedIcon />
          <MoodBadRoundedIcon />
        </div>
        <p>Vous n'avez pas la permission d'accéder à cette ressource, servez-vous du menu en haut de la page pour accéder à la navigation</p>
      </div>
    </div>
  )
}

export default NotAllowed
