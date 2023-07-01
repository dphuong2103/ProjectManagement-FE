import NavBar from '../../components/NavBar'
import styles from '../../styles/HomePage.module.scss';
import { useAuthContext, useProjectsDetailsContext } from '../../constant/context-value';
import { useCallback, useEffect } from 'react';
import { getUserProjectsDetails } from '../../utilities/fetchData';
import { Outlet } from 'react-router-dom';

function Homepage() {
    const { currentUser } = useAuthContext();
    const { setProjectDetails } = useProjectsDetailsContext();
    const getUserProjects = useCallback(async () => {
        const getProjectDetailsResponse = await getUserProjectsDetails(currentUser?.id ?? '');
        setProjectDetails(getProjectDetailsResponse.data)
    }, [currentUser?.id, setProjectDetails]);

    useEffect(() => {
        getUserProjects();
    }, [getUserProjects]);

    return (
        <div className={styles['homepage__wrapper']} >
            <NavBar />
            <div className={styles['content__container']}>
                <Outlet />
            </div>
        </div >
    )
}

export default Homepage