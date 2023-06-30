import styles from '../styles/EmptyTaskList.module.scss'
function EmptyTaskList() {
    return (
        <div className={styles['container']}><p className={styles['message']}>
            No tasks were found, select create to add new task!
        </p > 
        </div>
    )
}

export default EmptyTaskList