import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { IComment, ITask, IUser, Status, StatusMapping } from '../../data-types/DataType';
import { getCommentsByTaskId, getTaskDetail, updateCommentDetails, updateTaskDetails } from '../../utilities/fetchData';
import styles from '../../styles/TaskDetail.module.scss';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material';
import TaskComments from './TaskComments';
import { getTaskStatusNameByValue, initialTask } from '../../utilities/otherFunction';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import MyModal from '../MyModal';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment from 'moment';
import { getDateString } from '../../utilities/dateTimeFormat';
import { useAuthContext, useSpinnerContext, useTaskListContext } from '../../constant/context-value';
import SearchUserField from '../SearchUserField';
import { toast } from 'react-toastify';

enum ActivityOption {
    // all = 'all',
    comment = 'comment'
}

function TaskDetail() {
    const { taskID } = useParams();
    const [originalTask, setOriginalTask] = useState<ITask>(initialTask());
    const [showActivityOption, setShowActivityOption] = useState(ActivityOption.comment);
    const [comments, setComments] = useState<IComment[]>([]);
    const [newComment, setNewComment] = useState('');
    const { currentUser } = useAuthContext();
    const [isTaskNameFocused, setIsTaskNameFocused] = useState(false);
    const [taskShown, setTaskShown] = useState<ITask>(initialTask());
    const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
    const [isOpeningFinishTaskModal, setIsOpeningFinishTaskModal] = useState(false);
    const [finishTime, setFinishTime] = useState<moment.Moment | null>(null);
    const [isShowingAssigneeField, setIsShowingAssigneeField] = useState(false);
    const { setTaskList } = useTaskListContext();
    const { setIsLoading } = useSpinnerContext();
    useEffect(() => {
        getTask();
        getComments();

        async function getTask() {
            if (!taskID) return;
            try {
                const taskDetailResponse = await getTaskDetail(taskID);
                setOriginalTask(taskDetailResponse.data);
                setTaskShown({ ...taskDetailResponse.data });
            } catch (err) {
                console.error(err);
            }
        }

        async function getComments() {
            if (!taskID) return;
            try {
                const getCommentsResponse = await getCommentsByTaskId(taskID);
                setComments(sortComments(getCommentsResponse.data));
            } catch (err) {
                console.log(err);
            }
        }
    }, [taskID])

    useEffect(() => {
        setTaskList(prevTaskList => prevTaskList.map(task => {
            if (task.id === originalTask.id) {
                return originalTask;
            } return task
        }))
        setTaskShown({ ...originalTask });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalTask])

    function handleChangeShowActivity(_event: React.MouseEvent<HTMLElement>,
        option: keyof typeof ActivityOption) {
        setShowActivityOption(ActivityOption[option])
    }

    function handleChangeTaskShownDetails(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setTaskShown({ ...taskShown, [e.target.name]: e.target.value });
    }

    async function handleCreateNewComment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!currentUser || !taskID) return;
        try {
            const comment: IComment = {
                content: newComment,
                taskID: taskID,
                isDeleted: false,
                creatorID: currentUser.id,
            };
            const commentResponse = await updateCommentDetails(comment);
            setComments(prev => sortComments([...prev, commentResponse.data]));
            setNewComment('');
        }
        catch (err) {
            console.log(err);
        }
    }

    function handleOnBlurTaskNameField() {
        setTaskShown({ ...originalTask });
        setIsTaskNameFocused(false);
    }

    function sortComments(comments: IComment[]) {
        comments.sort((a, b) => {
            if (!a.createdTime || !b.createdTime) return 0;
            const dateA = new Date(a.createdTime);
            const dateB = new Date(b.createdTime);
            return (dateB.getTime()) - (dateA.getTime());

        });
        return comments;
    }

    async function handleSubmitUpdateTaskDetails(e: React.FormEvent<HTMLFormElement>
    ) {
        e.preventDefault();
        try {
            setIsLoading(true);
            const updatedTaskResponse = await updateTaskDetails(taskShown);
            setOriginalTask({ ...updatedTaskResponse.data });
            toast.success("Task updated successfully")
        } catch (err) {
            console.log(err);
            setTaskShown({ ...originalTask });
        }
        finally {
            handleFinishAction();
            setIsLoading(false);
        }
    }

    function handleClickCancelCommentField() {
        setNewComment('');
    }

    async function handleSubmitChangeStatus(event: SelectChangeEvent) {
        taskShown.status = parseInt(event.target.value);
        if (getTaskStatusNameByValue(parseInt(event.target.value)) === Status.Completed) {
            setIsOpeningFinishTaskModal(true);
        }
        else {

            try {
                taskShown.finishTime = null;
                const updatedTaskResponse = await updateTaskDetails(taskShown);
                setOriginalTask({ ...updatedTaskResponse.data });
                toast.success("Task updated successfully")
            }
            catch (err) {
                console.log(err);
                setTaskShown({ ...originalTask });
            }
            finally {
                handleFinishAction()
            }
        }
    }

    async function handleSubmitFinishTime() {
        if (!finishTime) return;
        try {
            taskShown.finishTime = finishTime.toDate();
            const updatedTaskResponse = await updateTaskDetails(taskShown);
            setOriginalTask({ ...updatedTaskResponse.data });
            setIsTaskNameFocused(false);
            setIsDescriptionFocused(false);
            toast.success("Task updated successfully")
        }
        catch (err) {
            console.log(err);
            toast.error("Cannot update Task, please try again")
        }
        finally {
            handleFinishAction()
        }
    }

    function handleCancelFinishTaskModal() {
        setTaskShown({ ...originalTask });
        handleFinishAction();
    }

    async function handleChangeAssignee(selectedUser: IUser | null) {
        try {
            if (!selectedUser) return;
            if (selectedUser.id === taskShown.assignee?.id) return;
            taskShown.assignee = selectedUser;
            taskShown.assigneeID = selectedUser.id;
            const updatedTaskResponse = await updateTaskDetails(taskShown);
            setOriginalTask({ ...updatedTaskResponse.data });
            toast.success("Task updated successfully")
        } catch (err) {
            setTaskShown({ ...originalTask });
            console.log(err);
            toast.error("Cannot update Task, please try again") 
        }
        finally {
            setIsShowingAssigneeField(false);
        }
    }

    function handleFinishAction() {
        setIsTaskNameFocused(false);
        setIsDescriptionFocused(false);
        setIsOpeningFinishTaskModal(false)
    }

    function handleCloseAssigneeField() {
        setIsShowingAssigneeField(false);
        setTaskShown({ ...originalTask });
    }

    return (
        <div className={styles['container']}>
            <div className={styles['left-container']}>

                <form className={styles['form']} onSubmit={handleSubmitUpdateTaskDetails} >
                    <TextField
                        name='name'
                        required
                        value={taskShown.name}
                        label='Summary'
                        variant='outlined'
                        placeholder='Task summary'
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChangeTaskShownDetails}
                        fullWidth={true}
                        onFocus={() => setIsTaskNameFocused(true)}

                    />
                    {isTaskNameFocused && <div className={styles['btn-actions']}>
                        <button type='submit'>
                            <CheckIcon />
                        </button>
                        <button type='button'>
                            <ClearIcon onMouseDown={handleOnBlurTaskNameField} />
                        </button>
                    </div>}
                </form>
                <form className={styles['form']} onSubmit={handleSubmitUpdateTaskDetails} >
                    <TextField
                        minRows={4}
                        placeholder='Add a description...'
                        name='description'
                        value={taskShown?.description}
                        multiline
                        label='Description'
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChangeTaskShownDetails}
                        onFocus={() => setIsDescriptionFocused(true)}
                    />
                    {isDescriptionFocused && <div className={styles['btn-actions']}>
                        <button type='submit'>
                            <CheckIcon />
                        </button>
                        <button type='button'>
                            <ClearIcon onClick={handleOnBlurTaskNameField} />
                        </button>
                    </div>}
                </form>
                <span className={styles['activity']}>Activity</span>
                <div>
                    <span>Show: </span>
                    <ToggleButtonGroup
                        color="primary"
                        value={showActivityOption}
                        exclusive
                        onChange={handleChangeShowActivity}
                        aria-label="Platform"
                    >
                        {Object.keys(ActivityOption).map((key) => <ToggleButton value={ActivityOption[key as keyof typeof ActivityOption]} key={ActivityOption[key as keyof typeof ActivityOption]}>{ActivityOption[key as keyof typeof ActivityOption]}</ToggleButton>)}
                    </ToggleButtonGroup>
                </div>

                <form className={styles['input-comment__form']} onSubmit={handleCreateNewComment}>
                    <div className={styles['input-comment__container']}>
                        <TextField
                            minRows={3}
                            multiline
                            fullWidth
                            placeholder='Input comment...'
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            required
                        />
                        <div className={styles['action-container']}>
                            <Button variant='text' onClick={handleClickCancelCommentField}>Cancel</Button>
                            <Button variant="contained" type='submit'>
                                Save
                            </Button>
                        </div>
                    </div>

                </form>
                <TaskComments comments={comments} />
            </div>
            <div className={styles['right-container']}>
                <FormControl>
                    <InputLabel>
                        Status
                    </InputLabel>

                    <Select
                        value={taskShown.status.toString()}
                        label="Status"
                        name='status'
                        onChange={handleSubmitChangeStatus}
                        required
                        variant='outlined'

                        sx={{
                            '& .MuiSelect-select': {
                                textAlign: 'left'
                            }
                        }}
                    >
                        {Object.keys(Status).map(statusKey => <MenuItem
                            key={StatusMapping[statusKey as keyof typeof StatusMapping]}
                            value={StatusMapping[statusKey as keyof typeof StatusMapping]}>{`${Status[statusKey as keyof typeof Status]}`}
                        </MenuItem>)}
                    </Select>
                </FormControl>

                <div className={styles['task-more-info__container']}>
                    <table className={styles['task-more-info__table']}>
                        <tbody className={styles['task-more-info__table__body']}>
                            <tr className={styles['data-row']}>
                                <th className={styles['header']}>Assignee:</th>
                                {
                                    isShowingAssigneeField ? <td className={styles['data']}>
                                        <div className={styles['edit-field__container']}>
                                            <SearchUserField label='' selectedUser={taskShown.assignee ?? null} setSelectedUser={handleChangeAssignee} fullWidth={true} />
                                            <button onClick={handleCloseAssigneeField}>
                                                <ClearIcon />
                                            </button>
                                        </div>
                                    </td> : <td className={styles['data']} onClick={() => setIsShowingAssigneeField(true)}>{taskShown.assignee?.displayName ?? ''}</td>
                                }
                            </tr>
                            <tr className={styles['data-row']}>
                                <th className={styles['header']}>Reporter:</th>
                                <td className={styles['data']}>{taskShown.creator?.displayName ?? ''}</td>
                            </tr>
                            <tr className={styles['data-row']}>
                                <th className={styles['header']}>Finish Time:</th>
                                <td className={styles['data']}>{taskShown.finishTime ? getDateString(taskShown.finishTime) : ''}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <MyModal isOpen={isOpeningFinishTaskModal} setIsOpen={setIsOpeningFinishTaskModal} >
                    <>
                        <MyModal.Header>Task Completed</MyModal.Header>
                        <div className={styles['finish-time__container']}>
                            <div className={styles['finish-time']}>
                                <LocalizationProvider dateAdapter={AdapterMoment} >
                                    <DatePicker label='Finished time' value={finishTime} onChange={newDate => setFinishTime(moment(newDate))} />
                                </LocalizationProvider>
                            </div>

                            <div className={styles['action__container']}>
                                <Button variant='text' onClick={handleCancelFinishTaskModal}>Cancel</Button>
                                <Button variant='contained' onClick={handleSubmitFinishTime}>Done</Button>
                            </div>
                        </div>
                    </>
                </MyModal>

            </div>
        </div >
    )
}

export default TaskDetail