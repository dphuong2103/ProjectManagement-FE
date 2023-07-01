import { Outlet, useOutletContext, useParams } from 'react-router-dom'
import SideBar from '../SideBar'
import styles from '../../styles/MainContentProjectDetails.module.scss'
import { useEffect, useState } from 'react';
import { IProject } from '../../data-types/DataType';
import { getProjectDetails } from '../../utilities/fetchData';
import Drawer from '@mui/material/Drawer/Drawer';
import { Box, } from '@mui/material';
import { useShowingSideBarOnSmallScreenContext } from '../../constant/context-value';
function MainContentProjectDetails() {
    const [project, setProject] = useState<IProject | null>(null);
    const { isShowingSideBarOnSmallScreen, setIsShowingSideBarOnSmallScreen } = useShowingSideBarOnSmallScreenContext();
    const [width, setWidth] = useState(window.innerWidth);
    const { projectID } = useParams();
    useEffect(() => {
        function handleResize() {
            setWidth(window.innerWidth);
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [width]);

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

    const toggleDrawer =
        (isShowing: boolean) =>
            (event: React.KeyboardEvent | React.MouseEvent) => {
                if (
                    event.type === 'keydown' &&
                    ((event as React.KeyboardEvent).key === 'Tab' ||
                        (event as React.KeyboardEvent).key === 'Shift')
                ) {
                    return;
                }
                setIsShowingSideBarOnSmallScreen(isShowing);
            };

    return (
        <div className={styles['project-details-container']}>
            {
                width <= 600 ? <Drawer
                    anchor={'left'}
                    open={isShowingSideBarOnSmallScreen}
                    onClose={() => setIsShowingSideBarOnSmallScreen(false)}
                    sx={{
                        width: 240,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
                    }}

                >
                    <Box sx={{ width: 250 }}
                        role="presentation"
                        onClick={() => toggleDrawer(false)}
                        onKeyDown={() => toggleDrawer(false)}>
                        <SideBar project={project} />
                    </Box>

                </Drawer> : <SideBar project={project} />
            }
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