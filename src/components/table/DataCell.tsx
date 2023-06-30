function TableCell({ children }: ITableCellProps) {
  return (
    <div>{children}</div>
  )
}

export default TableCell

interface ITableCellProps {
  children: JSX.Element
} 