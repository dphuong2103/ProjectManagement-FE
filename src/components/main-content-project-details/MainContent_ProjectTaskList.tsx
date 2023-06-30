import TaskListTable from './TaskListTable';
import EmptyTaskList from '../EmptyTaskList';
import { useTaskListContext } from '../../constant/context-value';

function MainContentProjectTaskList() {
    const { taskList } = useTaskListContext();

    if (taskList.length == 0) {
        return <EmptyTaskList />
    }

    return (
        <TaskListTable tasks={taskList} />
    )
}

export default MainContentProjectTaskList