import { createContext, useState } from 'react'
import { BarLoader } from 'react-spinners';
import styles from '../styles/SpinnerContext.module.scss';
export const SpinnerContextProvider = createContext({} as ISpinnerContextValue);

function SpinnerContext({ children }: ISpinnerContextProps) {
    const [isLoading, setIsLoading] = useState(false);
    return (
        <SpinnerContextProvider.Provider value={{ setIsLoading }}>
            {children}
            {isLoading && <>
                <div className={styles['background']}>
                </div>
                <div className={styles['spinner__container']}>
                    <BarLoader
                        color={'#36b3d6'}
                        loading={isLoading}
                        cssOverride={{ width: '20rem' }}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                </div>
            </>}

        </SpinnerContextProvider.Provider>
    )
}

export default SpinnerContext

interface ISpinnerContextProps {
    children: JSX.Element
}

interface ISpinnerContextValue {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}