import { Outlet, useNavigate } from 'react-router-dom';
import styles from '@/styles/pages/home.module.scss';
import ButtonUI from '@/components/UI/ButtonUI';
import { deauthenticate } from '@/utils/auth';

const Home = () => {
  const navigate = useNavigate();

  const logout = () => {
    deauthenticate();
    navigate('/login');
  }

  return (
    <div className={styles.home}>
      <div className={styles.logout}>
        <ButtonUI onClick={logout} style={{maxWidth: '100px'}}>
          Logout
        </ButtonUI>
      </div>

      <Outlet />
    </div>
  );
};

export default Home;
