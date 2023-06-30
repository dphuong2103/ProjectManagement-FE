import { LegacyRef } from 'react';
import styles from '../styles/CustomModal.module.scss'

function Body({ children }: IContent) {
    <div>
        {children}
    </div >
}

function Header({ children }: IContent) {
    return <span className={styles['header']}>
        {children}
    </span>
}

function Bottom({ children }: IContent) {
    return <div>{children}</div>
}

function MyModal({ children, isOpen, setIsOpen, modalRef }: IModalProps) {
    return (
        <>
            {isOpen && <>
                <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
                <div className={styles.centered} ref={modalRef}>
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            {children}
                        </div>
                    </div>
                </div>
            </>}
        </>
    )
}

MyModal.Body = Body;
MyModal.Header = Header;
MyModal.Bottom = Bottom;

export default MyModal

interface IContent {
    children: React.ReactNode;
}

interface IModalProps {
    children: JSX.Element,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    modalRef?: LegacyRef<HTMLDivElement>
}