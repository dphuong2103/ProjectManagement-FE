import { useContext } from 'react';
import { SpinnerContextProvider } from '../context/SpinnerContext';
import { ProjectDetailsContextProvider } from '../context/ProjectDetailsContext';
import { AuthContextProvider } from '../context/AuthContext';
import { TaskListContextProvider } from '../context/TasklistContext';

export const useSpinnerContext = () => useContext(SpinnerContextProvider);

export const useProjectsDetailsContext = () =>
  useContext(ProjectDetailsContextProvider);

export const useAuthContext = () => useContext(AuthContextProvider);

export const useTaskListContext = () => useContext(TaskListContextProvider);
