import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material'
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import { useProjectsDetailsContext } from '../constant/context-value';
import ProjectDataRow from './table/ProjectDataRow';
import styles from '../styles/MainContentProjectList.module.scss';
import { useState } from 'react';
import { IProject } from '../data-types/DataType';
import { auth } from '../firebase/firebase-config';
import { createProject } from '../utilities/fetchData';
import { toast } from 'react-toastify';
import MyModal from './MyModal';
import EmptyProjectList from './main-content-project-details/EmptyProjectList';

function MainContentProjectList() {
  const { projectDetails, setProjectDetails } = useProjectsDetailsContext();
  const [isOpeningNewProjectModal, setIsOpeningNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  function toggleIsOpeningNewProjectModal() {
    setIsOpeningNewProjectModal(prev => !prev);

  }

  async function handleCreateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newProject: IProject = {
      name: newProjectName,
      description: newProjectDescription,
      creatorID: auth.currentUser?.uid ?? '',
      leaderID: auth.currentUser?.uid ?? '',
      isDeleted: false,
    }
    try {
      const userProjectResponse = await createProject(newProject);
      setProjectDetails(prev => [...prev, userProjectResponse.data]);
      toast.success('Project created successfully');
      toggleIsOpeningNewProjectModal();
    } catch (err) {
      console.log(err);
    }
  }


  return (
    <div className={styles['project-list-container']}>
      <div className={styles['actions']}>
        <span>Projects</span>
        <Button variant='contained' onClick={toggleIsOpeningNewProjectModal}>Create Project</Button>
      </div>
      {
        (!projectDetails || projectDetails.length === 0) ? <EmptyProjectList /> : <TableContainer>
          <Table aria-label="table">
            <TableHead>
              <TableRow>
                <TableCell align='center'><StarOutlineIcon /></TableCell>
                <TableCell>Project</TableCell>
                <TableCell align="left">Project Leader</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {projectDetails.map((projectDetail) => <ProjectDataRow key={projectDetail.project.id} projectDetail={projectDetail} />)}
            </TableBody>
          </Table>
        </TableContainer>
      }

      <MyModal isOpen={isOpeningNewProjectModal} setIsOpen={setIsOpeningNewProjectModal} >
        <>
          <MyModal.Header>Create new Project</MyModal.Header>
          <form className={styles['modal__form']} onSubmit={handleCreateProject}>
            <div className={styles['container']}>
              <TextField
                required
                type='text'
                label="Project name"
                variant="outlined"
                fullWidth
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
              />
              <TextField
                variant="outlined"
                placeholder="Description"
                multiline
                rows={3}
                maxRows={6}
                fullWidth
                type='text' label="Description"
                value={newProjectDescription}
                onChange={e => setNewProjectDescription(e.target.value)}
              />
              <div className={styles['action-container']}>
                <Button variant="text" onClick={toggleIsOpeningNewProjectModal}>Cancel</Button>
                <Button variant="contained" type='submit'>Create</Button>
              </div>
            </div>
          </form>
        </>

      </MyModal>
    </div>
  )
}

export default MainContentProjectList