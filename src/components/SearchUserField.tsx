import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import { IUser } from '../data-types/DataType';
import { useEffect, useState } from 'react';
import { searchUsers } from '../utilities/fetchData';

function SearchUserField({ excludeUsers, selectedUser, setSelectedUser, label, fullWidth, onBlur }: ISearchUserFieldProps) {
    const [isOpenSearchMember, setIsOpenSearchMember] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [users, setUsers] = useState<IUser[]>([]);
    const [isLoadingSearchingMember, setIsLoadingSearchingMember] = useState(false);
    useEffect(() => {
        if (!inputValue) return;
        const searchUserTimeout = setTimeout(() => {
            getMembers();
        }, 500)

        return () => clearTimeout(searchUserTimeout)

        async function getMembers() {
            setUsers([]);
            setIsLoadingSearchingMember(true);
            try {
                const searchedUsersResponse = await searchUsers(inputValue);
                const filteredUsers = excludeUsers ? searchedUsersResponse.data.filter(user => !excludeUsers.some((excludeUser) => excludeUser.id === user.id)) : searchedUsersResponse.data;
                setUsers(filteredUsers);

            } catch (err) {
                console.log(err)
            } finally {
                setIsLoadingSearchingMember(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValue])
    return (
        <Autocomplete
            fullWidth={fullWidth}
            onBlur={onBlur}
            sx={{ minWidth: 200 }}
            open={isOpenSearchMember}
            value={selectedUser}
            onChange={(_event: unknown, newValue: IUser | null) => {
                if (newValue) {
                    setSelectedUser(newValue);
                }
            }}
            filterOptions={(x) => x}
            onOpen={() => setIsOpenSearchMember(true)}
            onClose={() => setIsOpenSearchMember(false)}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={(option: IUser) => `${option.displayName} ${option.email}`}
            options={users}
            inputValue={inputValue}
            onInputChange={(_event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            clearIcon={false}
            loading={isLoadingSearchingMember}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth={fullWidth}
                    label={label ?? 'Search user'}
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {isLoadingSearchingMember ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    )
}

export default SearchUserField

interface ISearchUserFieldProps {
    excludeUsers?: IUser[],
    selectedUser: IUser | null,
    setSelectedUser: (selectedUser: IUser | null) => void,
    label?: string,
    fullWidth?: boolean
    onBlur?: () => void
}