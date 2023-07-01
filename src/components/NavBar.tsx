import PageTitle from './PageTitle';
import styles from '../styles/NavBar.module.scss';
import { Avatar, Button, Divider, FormControl, IconButton, InputLabel, ListItemIcon, Menu, MenuItem, Select, SelectChangeEvent, TextField, Tooltip } from '@mui/material';
import { auth, firebaseSignOut } from '../firebase/firebase-config';
import MyModal from './MyModal';
import { useEffect, useState } from 'react';
import { useAuthContext, useProjectsDetailsContext, useShowingSideBarOnSmallScreenContext, useSpinnerContext, useTaskListContext } from '../constant/context-value';
import { ITask, IUser, Status, StatusMapping } from '../data-types/DataType';
import { updateTaskDetails, updateUserProfile } from '../utilities/fetchData';
import { Link, useParams } from 'react-router-dom';
import SearchUserField from './SearchUserField';
import { toast } from 'react-toastify';
import { Logout, } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
function NavBar() {
    const [isOpeningNewProjectModal, setIsOpeningNewProjectModal] = useState(false);
    const { currentUser, setCurrentUser } = useAuthContext();
    const { projectDetails } = useProjectsDetailsContext();
    const { projectID } = useParams();
    const { setTaskList } = useTaskListContext();
    const [settingMenuAnchorEl, setSettingMenuAnchorEl] = useState<null | HTMLElement>(null);
    const [isOpeningCurrentUserInfoModal, setIsOpeningCurrentUserInfoModal] = useState(false);
    const openSettingMenu = Boolean(settingMenuAnchorEl);
    const { setIsLoading } = useSpinnerContext();
    const [userShown, setUserShown] = useState<IUser>({} as IUser);
    const { setIsShowingSideBarOnSmallScreen } = useShowingSideBarOnSmallScreenContext();

    function initialTask(): ITask {
        return {
            name: '',
            description: '',
            status: 0,
            projectID: projectDetails[0]?.projectID ?? '',
            assigneeID: auth.currentUser?.uid ?? '',
            creatorID: auth.currentUser?.uid ?? '',
            isDeleted: false,
            createdTime: new Date(),
        }
    }

    useEffect(() => {
        if (!currentUser) return;
        setUserShown(currentUser);
    }, [currentUser]);

    const [newTask, setNewTask] = useState<ITask>(initialTask());

    async function handleSignOut() {
        try {
            await firebaseSignOut();
        }
        catch (err) {
            console.log(err);
        }
    }

    function handleChangeTextField(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setNewTask(prevNewTask => { return { ...prevNewTask, [e.target.name]: e.target.value } });
    }

    function handleChangeDropdownField(event: SelectChangeEvent) {
        if (event.target.name == 'status') {
            setNewTask({ ...newTask, status: parseInt(event.target.value) });
        }
        setNewTask({ ...newTask, [event.target.name]: event.target.value })
    }

    function toggleIsOpeningNewProjectModal() {
        if (!isOpeningNewProjectModal) {
            if (projectDetails.length == 0) {
                toast.error('Please create at least one project!');
                return;
            }
            setNewTask({ ...initialTask(), projectID: projectID ?? projectDetails[0].project.id ?? '' });
        }
        setIsOpeningNewProjectModal(prev => !prev);
    }

    async function handleCreateTask() {
        try {
            setIsLoading(true);
            const task: ITask = { ...newTask, creatorID: auth.currentUser?.uid ?? '', assignee: undefined }
            const updatedTaskResponse = await updateTaskDetails(task);
            setIsOpeningNewProjectModal(false);
            setTaskList(prevTaskList => [...prevTaskList, updatedTaskResponse.data])
            toast.success('Task created successfully!');
        } catch (err) {
            toast.error('Cannot create task, please try again!')
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    function handleChangeAssignee(selectedUser: IUser | null) {
        if (selectedUser) {
            setNewTask({ ...newTask, assigneeID: selectedUser?.id ?? '', assignee: selectedUser });
        }
    }

    function handleCloseUserSettings() {
        setSettingMenuAnchorEl(null);
    }
    function handleManageActionClick() {
        setSettingMenuAnchorEl(null);
        setIsOpeningCurrentUserInfoModal(true);
    }

    function handleOnChangeDisplayName(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setUserShown({ ...userShown, displayName: e.target.value });
    }

    async function handleSubmitUpdateUser() {
        try {
            await updateUserProfile(userShown);
            setCurrentUser({ ...userShown });
            setIsOpeningCurrentUserInfoModal(false);
            toast.success('Updated user profile successfully!');
        } catch (e) {
            currentUser && setUserShown({ ...currentUser });
            console.log(e);
        }
    }

    return (
        <div className={styles['navbar__container']}>

            <div className={styles['navbar__left']}>
                {
                    projectID && <button className={styles['btn-menu']} onClick={() => setIsShowingSideBarOnSmallScreen(true)} >
                        <MenuIcon />
                    </button>
                }
                <Link className={styles['btn-title']} to='/homePage'>
                    <PageTitle isHiddenOnSmallDevice={true}>Project Management</PageTitle>
                </Link>
                <Button variant='contained' onClick={toggleIsOpeningNewProjectModal}>Create</Button>
            </div>
            <div className={styles['navbar__right']}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={(event: React.MouseEvent<HTMLElement>) => setSettingMenuAnchorEl(event.currentTarget)}
                        size="small"
                        sx={{ height: '3rem' }}
                        aria-controls={openSettingMenu ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openSettingMenu ? 'true' : undefined}
                    >
                        <Avatar src={`https://ui-avatars.com/api/?name=${currentUser?.displayName}&background=0D8ABC&color=fff&rounded=true&font-size=0.4&length=1&color=ffffff`} className={styles['avatar']} />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={settingMenuAnchorEl}
                    id="account-menu"
                    open={openSettingMenu}
                    onClose={handleCloseUserSettings}
                    onClick={handleCloseUserSettings}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            // overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'background.paper',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >

                    <MenuItem onClick={handleManageActionClick}>
                        <Avatar /> My account
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleSignOut}>
                        <ListItemIcon>
                            <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>

            </div>

            <MyModal isOpen={isOpeningNewProjectModal} setIsOpen={setIsOpeningNewProjectModal} >
                <>
                    <MyModal.Header>Create new task</MyModal.Header>
                    <form className={styles['modal__form']}>
                        <div className={styles['container']}>
                            <FormControl>
                                <InputLabel>
                                    Project
                                </InputLabel>

                                <Select
                                    value={newTask.projectID}
                                    label="Project"
                                    onChange={handleChangeDropdownField}
                                    required
                                    variant='outlined'
                                    name='projectID'
                                    sx={{
                                        '& .MuiSelect-select': {
                                            textAlign: 'left'
                                        }
                                    }}
                                >
                                    {projectDetails.map((projectDetail) => <MenuItem value={projectDetail.project.id} key={projectDetail.id}>{projectDetail.project.name}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <TextField
                                required
                                type='text'
                                label='Summary'
                                variant='outlined'
                                fullWidth
                                name='name'
                                value={newTask.name}
                                onChange={handleChangeTextField}
                            />

                            <TextField
                                variant='outlined'
                                placeholder='Description'
                                multiline
                                maxRows={6}
                                fullWidth
                                type='text'
                                name='description'
                                label='Description'
                                value={newTask.description}
                                onChange={handleChangeTextField}
                            />

                            <FormControl>
                                <InputLabel>
                                    Status
                                </InputLabel>

                                <Select
                                    value={newTask.status.toString()}
                                    label="Status"
                                    name='status'
                                    onChange={handleChangeDropdownField}
                                    required
                                    variant='outlined'
                                    sx={{
                                        '& .MuiSelect-select': {
                                            textAlign: 'left'
                                        }
                                    }}
                                >
                                    {Object.keys(Status).map(statusKey => <MenuItem key={StatusMapping[statusKey as keyof typeof StatusMapping]} value={StatusMapping[statusKey as keyof typeof StatusMapping]}>{`${Status[statusKey as keyof typeof Status]}`}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <SearchUserField fullWidth selectedUser={newTask.assignee ?? null} setSelectedUser={handleChangeAssignee} label='Assignee' />
                            <div className={styles['action-container']}>
                                <Button variant="text" onClick={toggleIsOpeningNewProjectModal}>Cancel</Button>
                                <Button variant="contained" type='button' onClick={handleCreateTask}>Create</Button>
                            </div>
                        </div>
                    </form>
                </>

            </MyModal>

            <MyModal isOpen={isOpeningCurrentUserInfoModal} setIsOpen={setIsOpeningCurrentUserInfoModal} >
                <>
                    <MyModal.Header>User Information</MyModal.Header>
                    <form className={styles['user-info__form']}>
                        <div className={styles['user-info__container']}>
                            <TextField value={userShown?.displayName} InputLabelProps={{ shrink: true }} label='Name' fullWidth onChange={handleOnChangeDisplayName} />
                            <TextField value={userShown?.email} disabled label='Email' InputLabelProps={{ shrink: true }} fullWidth />
                        </div>
                        <div className={styles['actions__container']}>
                            <Button variant='text' onClick={() => setIsOpeningCurrentUserInfoModal(false)} >Cancel</Button>
                            <Button variant='contained' onClick={handleSubmitUpdateUser}>Ok</Button>
                        </div>
                    </form>
                </>

            </MyModal>

        </div>
    )
}

export default NavBar