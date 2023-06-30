import styles from '../styles/PageTitle.module.scss'
interface IPageTitleProps {
    isHiddenOnSmallDevice?: boolean,
    children: string
}
function PageTitle({ isHiddenOnSmallDevice, children }: IPageTitleProps) {
    return (
        <span className={`${styles['title']} ${isHiddenOnSmallDevice && styles['hide-on-small-device']}`}>{children}</span>
    )
}

export default PageTitle