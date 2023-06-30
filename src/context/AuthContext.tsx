import { createContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { IUser } from '../data-types/DataType';

export const AuthContextProvider = createContext({} as IAuthContextProps);

function AuthContext({ children }: { children: JSX.Element }) {
    const { value: currentUser, setLocalStorageValue: setCurrentUser } = useLocalStorage<IUser>('currentUser', undefined);

    return (
        <AuthContextProvider.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </AuthContextProvider.Provider>
    )
}

export default AuthContext

interface IAuthContextProps {
    currentUser?: IUser | null,
    setCurrentUser: (newValue: IUser | null) => void
}