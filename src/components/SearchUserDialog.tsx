import { Dialog, DialogTitle, DialogActions, Button } from '@mui/material'
import { IUser } from '../data-types/DataType'
import { useState } from 'react';
import styles from '../styles/SearchUserDialog.module.scss'
import SearchUserField from './SearchUserField';
function SearchUserDialog({ handleClickOkButton, isShowingDialog, setIsShowingDialog, excludeUsers }: ISearchUserDialogProps) {
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    function handleSubmit() {
        if (selectedUser) {
            handleClickOkButton(selectedUser);
            setSelectedUser(null);
        }
    }

    function handleSetSelectedUser(selectedUser: IUser | null) {
        setSelectedUser(selectedUser);
    }

    return (
        <Dialog open={isShowingDialog} onClose={() => setIsShowingDialog(false)}>
            <div className={styles['container']}>
                <DialogTitle>Add Member</DialogTitle>
                <SearchUserField
                    setSelectedUser={handleSetSelectedUser}
                    selectedUser={selectedUser}
                    excludeUsers={excludeUsers}
                    fullWidth
                />
                <DialogActions>
                    <Button onClick={() => setIsShowingDialog(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant='contained' >Add</Button>
                </DialogActions>
            </div>

        </Dialog >
    )
}

export default SearchUserDialog

interface ISearchUserDialogProps {
    isShowingDialog: boolean,
    setIsShowingDialog: React.Dispatch<React.SetStateAction<boolean>>
    handleClickOkButton: (user: IUser) => Promise<void>
    excludeUsers?: IUser[]
}