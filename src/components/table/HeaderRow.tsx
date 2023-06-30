
function HeaderRow({ headers }: IProps) {
    return (
        <thead>
            <tr>
                {headers.map(header => <th key={header}>{header}</th>)}
            </tr>
        </thead>

    )
}

export default HeaderRow

interface IProps {
    headers: string[]
}