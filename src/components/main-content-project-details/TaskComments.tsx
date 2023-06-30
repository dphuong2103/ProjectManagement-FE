import { IComment } from '../../data-types/DataType'
import TaskComment from './TaskComment'
import styles from '../../styles/TaskComments.module.scss'
function TaskComments({ comments }: ITaskCommentProps) {
    return (
        <div className={styles['container']}>
            {comments.map((comment) => <TaskComment comment={comment} key={comment.id} />)}
        </div>
    )
}

export default TaskComments

interface ITaskCommentProps {
    comments: IComment[]
}