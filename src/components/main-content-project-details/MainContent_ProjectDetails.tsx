import { Outlet, useOutletContext, useParams } from 'react-router-dom'
import SideBar from '../SideBar'
import styles from '../../styles/MainContentProjectDetails.module.scss'
import { useEffect, useState } from 'react';
import { IProject } from '../../data-types/DataType';
import { getProjectDetails } from '../../utilities/fetchData';

function MainContentProjectDetails() {
    const [project, setProject] = useState<IProject | null>(null);
    const { projectID } = useParams();

    useEffect(() => {
        getProject();
        async function getProject() {
            try {
                if (!projectID) return;
                const projectResponse = await getProjectDetails(projectID);
                setProject(projectResponse.data);
            } catch (err) {
                console.log(err);
            }
        }
    }, [projectID])

    return (
        <div className={styles['container']}>
            <SideBar project={project} />
            <div className={styles['content__container']}>
                <Outlet context={{ project, setProject }} />
            </div>
        </div>
    )
}

export default MainContentProjectDetails

// eslint-disable-next-line react-refresh/only-export-components
export function useProject() {
    return useOutletContext<ProjectContextType>();
}
interface ProjectContextType {
    project: IProject | null
    setProject: React.Dispatch<React.SetStateAction<IProject | null>>
}