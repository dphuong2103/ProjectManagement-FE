import { createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ITask } from '../data-types/DataType';
import { getProjectTasks } from '../utilities/fetchData';
import { toast } from 'react-toastify';
import { useSpinnerContext } from '../constant/context-value';

export const TaskListContextProvider = createContext({} as ITaskListContextValue);

function TasklistContext({ children }: ITaskListContextProps) {
    const {setIsLoading} = useSpinnerContext();
    const { projectID } = useParams();
    const [taskList, setTaskList] = useState<ITask[]>([]);

    useEffect(() => {
        getTasks();
        async function getTasks() {
            if (!projectID) return;
            try {
                setIsLoading(true);
                const getTasksResponse = await getProjectTasks(projectID);
                setTaskList(getTasksResponse.data);
            } catch (err) {
                toast.error('Can not get task list, please reload the page!');
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectID])
    return (
        <TaskListContextProvider.Provider value={{ taskList, setTaskList }}>{children}</TaskListContextProvider.Provider>
    )
}

export default TasklistContext

interface ITaskListContextValue {
    taskList: ITask[],
    setTaskList: React.Dispatch<React.SetStateAction<ITask[]>>
}
interface ITaskListContextProps {
    children: JSX.Element
}