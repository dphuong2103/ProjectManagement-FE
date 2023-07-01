import { NavLink } from 'react-router-dom'
import styles from '../styles/SideBar.module.scss'
import { IProject } from '../data-types/DataType';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ChecklistTwoToneIcon from '@mui/icons-material/ChecklistTwoTone';
import { useShowingSideBarOnSmallScreenContext } from '../constant/context-value';
function SideBar({ project }: ISideBarProps) {
  const { setIsShowingSideBarOnSmallScreen } = useShowingSideBarOnSmallScreenContext();

  return (
    <div className={styles['container']}>
      <span className={styles['project-title']}>{project?.name}</span>
      <div className={styles['view__container']}>
        <span className={styles['view__title']}>View</span>
      </div>
      <div className={styles['others__container']}>
        <NavLink className={({ isActive }) => `${isActive == true ? styles['isActive'] : ''} ${styles['other']}`} to={`/homepage/project/${project?.id}/tasklist`} onClick={() => setIsShowingSideBarOnSmallScreen(false)}>
          <ChecklistTwoToneIcon />
          <span>Task List</span>
        </NavLink>
        <NavLink className={({ isActive }) => `${isActive == true ? styles['isActive'] : ''} ${styles['other']}`} to={'projectSettings'} onClick={() => setIsShowingSideBarOnSmallScreen(false)}>
          <SettingsOutlinedIcon />
          <span>Project Settings</span>
        </NavLink>
      </div>
    </div >
  )
}

export default SideBar

interface ISideBarProps {
  project: IProject | null
}