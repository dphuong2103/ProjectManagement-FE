import { createContext, useState } from 'react'

export const ShowingSideBarOnSmallScreenContextProvider = createContext({} as ShowingSideBarOnSmallScreenContextValue);
function ShowingSideBarOnSmallScreenContext({ children }: ShowingSideBarOnSmallScreenContextProps) {
    const [isShowingSideBarOnSmallScreen, setIsShowingSideBarOnSmallScreen] = useState(false);
    return (
        <ShowingSideBarOnSmallScreenContextProvider.Provider value={{ isShowingSideBarOnSmallScreen, setIsShowingSideBarOnSmallScreen }}>{children}</ShowingSideBarOnSmallScreenContextProvider.Provider>
    )
}

export default ShowingSideBarOnSmallScreenContext

interface ShowingSideBarOnSmallScreenContextProps {
    children: React.ReactNode
}

interface ShowingSideBarOnSmallScreenContextValue {
    isShowingSideBarOnSmallScreen: boolean,
    setIsShowingSideBarOnSmallScreen: React.Dispatch<React.SetStateAction<boolean>>
}