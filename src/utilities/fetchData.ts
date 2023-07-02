import { toast } from 'react-toastify';
import axios, { AxiosError } from 'axios';
import { auth, firebaseSignOut } from '../firebase/firebase-config';
import {
  IComment,
  IProject,
  ITask,
  IUser,
  IUserProject,
} from '../data-types/DataType';
import { updateProfile } from 'firebase/auth';

const headers = () => {
  let token = '';
  const currentUserJson = localStorage.getItem('currentUser');
  if (currentUserJson) {
    const currentUser = JSON.parse(currentUserJson) as IUser;
    token = currentUser.accessToken ?? '';
  }

  return {
    Authorization: `${token}`,
    'Content-Type': 'application/json',
  };
};
const myAxios = () => {
  const axiosInstance = axios.create({ headers: headers() });
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError) => {
      // const originalRequest = error.config;
      if (error.response?.status === 401) {
        toast.warn('Please login again!',{toastId:'401'});
        await firebaseSignOut();
      }
      return Promise.reject(error);
    }
  );
  return axiosInstance;
};

export default myAxios;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const UPDATE_USER_PROFILE_URL = `${BASE_URL}${import.meta.env.VITE_API_USER}`;
const API_PROJECT = `${BASE_URL}${import.meta.env.VITE_API_PROJECT}`;

const UPDATE_USER_PROJECT = `${BASE_URL}${
  import.meta.env.VITE_API_UPDATE_USER_PROJECT
}`;

const GET_PROJECT_TASKS = `${BASE_URL}${
  import.meta.env.VITE_API_GET_PROJECT_TASKS
}`;

const API_MEMBERS = `${BASE_URL}${import.meta.env.VITE_API_MEMBERS}`;

const API_USER = `${BASE_URL}${import.meta.env.VITE_API_USER}`;

const API_TASK = `${BASE_URL}${import.meta.env.VITE_API_TASK}`;

const API_COMMENT = `${BASE_URL}${import.meta.env.VITE_API_COMMENT}`;

const API_GET_COMMENTS_BY_TASKID = `${API_COMMENT}/task`;

const API_USER_PROJECT = `${BASE_URL}${import.meta.env.VITE_API_USER_PROJECT}`;

export async function updateUserProfile(user: IUser) {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { displayName: user.displayName });
    return await myAxios().post(UPDATE_USER_PROFILE_URL, JSON.stringify(user));
  }
}

export async function createProject(project: IProject) {
  return myAxios().post<IUserProject>(API_PROJECT, project);
}

export async function getUserProjectsDetails(uid: string) {
  return await myAxios().get<IUserProject[]>(
    `${import.meta.env.VITE_API_BASE_URL}${
      import.meta.env.VITE_API_GET_USER_PROJECT_DETAILS
    }${uid}`
  );
}

export async function updateProjectDetails(project: IProject) {
  return myAxios().put<IProject>(API_PROJECT, JSON.stringify(project));
}

export async function updateUserProjectDetail(userProject: IUserProject) {
  return await myAxios().post(UPDATE_USER_PROJECT, JSON.stringify(userProject));
}

export async function updateTaskDetails(task: ITask) {
  return await myAxios().post<ITask>(API_TASK, JSON.stringify(task));
}

export async function getProjectTasks(projectId: string) {
  return await myAxios().get<ITask[]>(`${GET_PROJECT_TASKS}/${projectId}`);
}

export async function getProjectDetails(projectId: string) {
  return await myAxios().get<IProject>(`${API_PROJECT}/${projectId}`);
}

export async function getTaskDetail(taskId: string) {
  return await myAxios().get<ITask>(`${API_TASK}/${taskId}`);
}

export async function updateCommentDetails(comment: IComment) {
  return await myAxios().post<IComment>(
    `${API_COMMENT}`,
    JSON.stringify(comment)
  );
}

export async function getCommentsByTaskId(taskId: string) {
  return await myAxios().get<IComment[]>(
    `${API_GET_COMMENTS_BY_TASKID}/${taskId}`
  );
}

export async function getMembersByProjectId(projectId: string) {
  return await myAxios().get<IUser[]>(`${API_MEMBERS}/${projectId}`);
}

export async function searchUsers(searchValue: string) {
  return await myAxios().get<IUser[]>(`${API_USER}/searchUser/${searchValue}`);
}

export async function addUserProject(userId: string, projectId: string) {
  const userProject = {
    projectId: projectId,
    userId: userId,
  };
  return await myAxios().post(
    `${API_USER_PROJECT}`,
    JSON.stringify(userProject)
  );
}
