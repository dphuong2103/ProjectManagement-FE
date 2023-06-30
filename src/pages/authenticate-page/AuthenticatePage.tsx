import { Outlet } from 'react-router-dom'
import styles from '../../styles/AuthenticatePage.module.scss';

function AuthenticatePage() {
  return (
    <div className={styles['wrapper']}>
      <div className={styles['container']}>
        <Outlet />
      </div>
    </div>
  )
}

export default AuthenticatePage