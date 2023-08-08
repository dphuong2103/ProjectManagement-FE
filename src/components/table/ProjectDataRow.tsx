import { TableCell, TableRow } from '@mui/material'
import { IUserProject } from '../../data-types/DataType'
import StarIcon from '@mui/icons-material/Star';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { updateUserProjectDetail } from '../../utilities/fetchData';
import { useProjectsDetailsContext } from '../../constant/context-value';
import styles from '../../styles/ProjectDataRow.module.scss';
import { useNavigate } from 'react-router-dom';
import { routeName } from '../../constant/routes';

function ProjectDataRow({ projectDetail }: IProjectDataRowProps) {
    const { setProjectDetails, setSelectedProjectId } = useProjectsDetailsContext();

    const navigate = useNavigate();

    async function updateProjectFavorite() {
        projectDetail.isFavorite = !projectDetail.isFavorite;
        try {
            await updateUserProjectDetail(projectDetail);
            setProjectDetails(projectDetails => {
                projectDetails.map(pd => {
                    if (pd.id === projectDetail.id) {
                        return projectDetail
                    }
                });
                return [...projectDetails];
            });
        } catch (err) {
            console.log(err);
        }
    }

    function handleProjectClick() {
        if (projectDetail?.project?.id) {
            setSelectedProjectId(projectDetail.project.id);
        }
        navigate(`${routeName.projectDetails}/${projectDetail.project.id}/taskList`);
    }

    return (
        <TableRow
            key={projectDetail.id}
            sx={{ '& td, & th': { border: 0 } }}
        >
            <TableCell align='center' >
                <button onClick={updateProjectFavorite} className={styles['button']}>
                    {projectDetail.isFavorite ? <StarIcon color='success' /> : <StarOutlineIcon />}
                </button>
            </TableCell>
            <TableCell component="th" scope="row" align="left" className={styles['project-name__cell']}>
                <div className={styles['project-name__container']}>
                    <button onClick={handleProjectClick} className={styles['button']} >
                        {projectDetail.project.name}
                    </button>
                </div>
            </TableCell>
            <TableCell align="left">
                <div>
                    {projectDetail.project.leader?.displayName ?? '-'}
                </div>
            </TableCell>
        </TableRow>
    )
}

export default ProjectDataRow

interface IProjectDataRowProps {
    projectDetail: IUserProject
}