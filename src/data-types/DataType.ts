export interface IUser {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
  accessToken?: string;
}

export interface IProject {
  id?: string;
  name: string;
  description?: string;
  leaderID: string;
  leader?: IUser;
  creatorID: string;
  creator?: IUser;
  isDeleted: boolean;
  createdTime?: Date;
}

export enum Status {
  NotStarted = 'Not started',
  InProgress = 'In progress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}
export const StatusMapping = {
  NotStarted: 0,
  InProgress: 1,
  Completed: 2,
  Cancelled: 3,
};

export interface ITask {
  id?: string;
  name: string;
  description?: string;
  status: number;
  projectID: string;
  project?: IProject;
  assigneeID: string;
  assignee?: IUser;
  creatorID: string;
  creator?: IUser;
  isDeleted: boolean;
  createdTime: Date;
  finishTime?: Date | null;
}

export interface IUserProject {
  id?: string;
  userID: string;
  user: IUser;
  projectID: string;
  project: IProject;
  isFavorite?: boolean;
}

export interface IComment {
  id?: string;
  content: string;
  taskID: string;
  task?: ITask;
  creator?: IUser;
  creatorID: string | null;
  isDeleted: boolean;
  createdTime?: Date;
}
export interface IUserProjectWithProject {
  userProject: IUserProject;
  project: IProject;
}

export interface IUserWithUserProjectDetails {
  user: IUser;
  userProjects: IUserProjectWithProject[];
}
