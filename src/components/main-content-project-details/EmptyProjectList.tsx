import styles from '../../styles/EmptyProjectList.module.scss'
function EmptyProjectList() {
    return (
        <div className={styles['empty-project-list-container']}><p className={styles['message']}>
            No project was found, select Create Project to create a new project
        </p >
        </div>
    )
}

export default EmptyProjectList