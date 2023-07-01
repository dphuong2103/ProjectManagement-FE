import { useProject } from './MainContent_ProjectDetails'
import styles from '../../styles/ProjectSettings.module.scss'
import TextField from '@mui/material/TextField/TextField';
import { useEffect, useState } from 'react';
import { IProject, IUser } from '../../data-types/DataType';
import { getDateTimeString } from '../../utilities/dateTimeFormat';
import Button from '@mui/material/Button/Button';
import { addUserProject, getMembersByProjectId, updateProjectDetails } from '../../utilities/fetchData';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogTitle from '@mui/material/DialogTitle/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText/DialogContentText';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import { useNavigate } from 'react-router-dom';
import { routeName } from '../../constant/routes';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MemberDataRow from './MemberDataRow';
import SearchUserDialog from '../SearchUserDialog';
import SearchUserField from '../SearchUserField';
import { useProjectsDetailsContext, useSpinnerContext } from '../../constant/context-value';
import { toast } from 'react-toastify';
function ProjectSettings() {
    const navigate = useNavigate();
    const [projectShown, setProjectShown] = useState<IProject>({} as IProject);
    const { project, setProject } = useProject();
    const [isShownDeleteProjectConfirmDialog, setIsShownDeleteProjectConfirmDialog] = useState(false);
    const [isShowingAddMemberDialog, setIsShowingAddMemberDialog] = useState(false);
    const [members, setMembers] = useState<IUser[]>([]);
    const { setIsLoading } = useSpinnerContext();
    const { setProjectDetails } = useProjectsDetailsContext();
    useEffect(() => {
        if (project != null) {
            setProjectShown(project);

            setProjectDetails(prevProjectDetails => [...prevProjectDetails.map(upj =>{
                if(upj.projectID === project.id){
                    upj.project = project;
                    return upj;
                }
                return upj;
            })]);
        }
        getMembers();

        async function getMembers() {
            if (!project?.id) return;
            try {
                const getMembersResponse = await getMembersByProjectId(project.id);
                setMembers(getMembersResponse.data);
            } catch (err) {
                console.log(err);
            }
        }



    }, [project, project?.id, setProjectDetails])


    function handleClickCancel() {
        if (!project) return;
        setProjectShown(project);
    }

    function handleTextFieldChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        if (!project) return;
        setProjectShown({ ...projectShown, [e.target.name]: e.target.value })
    }

    async function handleSubmitUpdateProjectDetails(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true)
        try {
            const updateProjectResponse = await updateProjectDetails(projectShown);
            setProject({ ...updateProjectResponse.data });
            toast.success("Project updated successfully");
        } catch (err) {
            console.log(err);
            toast.error("Cannot update project details, please try again!");
            project && setProjectShown({ ...project });
        } finally {
            setIsLoading(false)
        }
    }

    function handleCloseDialog() {
        setIsShownDeleteProjectConfirmDialog(false);
    }

    async function handleSubmitDeleteProject() {
        try {
            if (!project) return;
            projectShown.isDeleted = true;
            await updateProjectDetails(projectShown);

            setProjectDetails(pervProjectList => {
                console.log(project);
                console.log(pervProjectList);
                return [...pervProjectList.filter(pj => pj.projectID !== project.id)]
            });
            toast.success("Project deleted successfully!");
            navigate(routeName.projectList);

        } catch (err) {
            console.log(err);
            toast.error("Cannot delete project, please try again");
        }
        finally {
            setIsShownDeleteProjectConfirmDialog(false);
        }
    }

    async function handleSubmitAddUser(user: IUser) {
        if (!project?.id) {
            console.log('Projectid is null');
            return;
        }
        try {
            await addUserProject(user.id, project.id);
            setMembers([...members, user])
            toast.success("User added");
        } catch (err) {
            console.log(err);
            toast.error("Cannot add user, please try again");
        }
    }

    async function handleChangeProjectLeader(selectedUser: IUser | null) {
        if (selectedUser) {
            try {
                setProjectShown({ ...projectShown, leader: selectedUser, leaderID: selectedUser.id });
                toast.success("Project leader changed")
            } catch (err) {
                console.log(err);
                toast.error("Cannot change project leader, please try again");
            }
        }
    }

    return (
        <div className={styles['container']}>
            <span className={styles['title']}>Details</span>
            <form className={styles['content-form']} onSubmit={handleSubmitUpdateProjectDetails}>
                <TextField value={projectShown?.name ?? ''} label='Name' InputLabelProps={{ shrink: true }} name='name' onChange={handleTextFieldChange} />
                <TextField value={projectShown?.description ?? ''} label='Description' InputLabelProps={{ shrink: true }} name='description' onChange={handleTextFieldChange} />
                <SearchUserField selectedUser={projectShown?.leader ?? null} setSelectedUser={handleChangeProjectLeader} label='Project Lead' fullWidth />
                {projectShown?.creator ? <TextField disabled label='Created By' defaultValue={projectShown.creator.displayName} onChange={console.log} /> : <></>}
                {projectShown?.createdTime ? <TextField disabled label='Created Time' defaultValue={getDateTimeString(projectShown?.createdTime)} onChange={console.log} /> : <></>}
                <div className={styles['action__container']}>
                    <Button variant='text' onClick={handleClickCancel} type='button'>Cancel</Button>
                    <Button variant='contained' type='submit'>Save</Button>
                </div>
            </form>

            <div className={styles['members__container']}>
                <div className={styles['top-bar__container']}>
                    <span className={styles['title']}>People</span>
                    <Button onClick={() => setIsShowingAddMemberDialog(true)} variant='outlined'>Add member</Button>
                    <SearchUserDialog
                        isShowingDialog={isShowingAddMemberDialog}
                        setIsShowingDialog={setIsShowingAddMemberDialog}
                        handleClickOkButton={handleSubmitAddUser}
                        excludeUsers={members}
                    />
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {members.map(member => <MemberDataRow member={member} key={member.id} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className={styles['delete-btn__container']}>
                <Button color='error' variant='outlined' fullWidth onClick={() => setIsShownDeleteProjectConfirmDialog(true)}>Delete Project</Button>
            </div>


            <Dialog
                open={isShownDeleteProjectConfirmDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Are you sure you when you want to delete?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmitDeleteProject} color='error'>Ok</Button>
                    <Button onClick={handleCloseDialog} autoFocus variant='outlined'>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    )
}

export default ProjectSettings

