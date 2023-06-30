import { createContext, useState } from 'react';
import { IUserProject } from '../data-types/DataType';

export const ProjectDetailsContextProvider = createContext({} as IProjectDetailsValue);

function ProjectDetailsContext({ children }: IProjectDetailsProps) {
    const [projectDetails, setProjectDetails] = useState<IUserProject[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');


    return (
        <ProjectDetailsContextProvider.Provider value={{ projectDetails, setProjectDetails, selectedProjectId, setSelectedProjectId }}>
            {children}
        </ProjectDetailsContextProvider.Provider>
    )
}

export default ProjectDetailsContext

interface IProjectDetailsProps {
    children: JSX.Element
}

export interface IProjectDetailsValue {
    projectDetails: IUserProject[],
    setProjectDetails: React.Dispatch<React.SetStateAction<IUserProject[]>>
    selectedProjectId: string
    setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>
}