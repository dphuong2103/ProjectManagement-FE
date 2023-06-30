import { TableBody, TableCell, TableRow } from '@mui/material'
import Table from '@mui/material/Table/Table'
import TableContainer from '@mui/material/TableContainer/TableContainer'
import TableHead from '@mui/material/TableHead/TableHead'
import { ITask } from '../../data-types/DataType'
import TaskDataRow from './TaskDataRow'

function TaskListTable({ tasks }: ITaskListProps) {
    return (
        <TableContainer>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell><span style={{ padding: '0.5rem' }}>Summary</span></TableCell>
                        <TableCell><span style={{ padding: '0.5rem' }}>Status</span></TableCell>
                        <TableCell><span style={{ padding: '0.5rem' }}>Assignee</span></TableCell>
                        <TableCell><span style={{ padding: '0.5rem' }}>Created on</span></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        tasks.map(task => <TaskDataRow key={task.id} task={task} />)
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default TaskListTable
interface ITaskListProps {
    tasks: ITask[]
}