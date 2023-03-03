import './nav.scss';
import AdminMenu from '../adminMenu/AdminMenu';


const Nav: React.FC = () => {
  return (
    <nav className='top-nav'>
      <AdminMenu />
    </nav>
  )
}

export default Nav
