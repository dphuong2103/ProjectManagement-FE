import { TableRow, TableCell } from '@mui/material';
import { IUser } from '../../data-types/DataType';

function MemberDataRow({ member }: IMemberDataRowProps) {
    return (

        <TableRow
            sx={{ '& td, & th': { border: 0 } }}
        >
            <TableCell align='left'>
                {member.displayName}
            </TableCell>
            <TableCell component="th" scope="row" align="left">
                {member.email}
            </TableCell>
            <TableCell align="left">
            </TableCell>
        </TableRow>
    )
}

export default MemberDataRow

interface IMemberDataRowProps {
    member: IUser
}