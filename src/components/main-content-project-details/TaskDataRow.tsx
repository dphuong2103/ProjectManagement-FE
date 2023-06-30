import { TableCell, TableRow } from '@mui/material'
import { ITask, StatusMapping } from '../../data-types/DataType'
import { getDateString } from '../../utilities/dateTimeFormat'
import { getKeyByValue, getTaskStatusNameByValue } from '../../utilities/otherFunction'
import { Link, useParams } from 'react-router-dom';
import { routeName } from '../../constant/routes';
import styles from '../../styles/TaskDataRow.module.scss'
function TaskDataRow({ task }: ITaskDataRowProps) {
    const { projectID } = useParams();
    const taskStatus = getKeyByValue(StatusMapping, task.status);
    return (
        <TableRow
            key={task.id}
            sx={{ '& td, & th': { border: 0 } }}
        >
            <TableCell align='left' style={{ maxWidth: '10rem' }}>
                <Link to={`${routeName.projectDetails}/${projectID}/task/${task.id}`} className={`${styles['link']} ${styles['cell-data-container']}`}>{task.name}</Link>
            </TableCell>
            <TableCell align="left">
                <span className={`${styles['cell-data-container']} ${styles['status']} ${styles[taskStatus]}`}>
                    {getTaskStatusNameByValue(task.status)}
                </span>
            </TableCell>
            <TableCell align="left">
                <span className={styles['cell-data-container']}>
                    {task.assignee?.displayName}
                </span>
            </TableCell>
            <TableCell align="left">
                <span className={styles['cell-data-container']}>
                    {getDateString(task.createdTime)}
                </span>
            </TableCell>
        </TableRow >
    )
}

export default TaskDataRow

interface ITaskDataRowProps {
    task: ITask
}