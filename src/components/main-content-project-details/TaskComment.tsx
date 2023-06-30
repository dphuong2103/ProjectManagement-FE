import { useAuthContext } from '../../constant/context-value';
import { IComment } from '../../data-types/DataType'
import styles from '../../styles/TaskComment.module.scss';
import { getDateTimeString } from '../../utilities/dateTimeFormat';
function TaskComment({ comment }: ITaskCommentProps) {
    const { currentUser } = useAuthContext();
    const imgURL = comment.creatorID === currentUser?.id ?
        `https://ui-avatars.com/api/?name=${comment.creator?.displayName}&background=0D8ABC&color=fff&rounded=true&font-size=0.4&length=1&color=ffffff` :
        `https://ui-avatars.com/api/?name=${comment.creator?.displayName}&background=random&rounded=true&font-size=0.4&length=1&color=ffffff`;
    return (
        <div className={styles['container']}>
            <img src={imgURL} className={styles['avatar']} />
            <div className={styles['comment-info_container']}>
                <div className={styles['comment-info']}>
                    <span className={styles['creator']}>{comment.creator?.displayName}</span>
                    <span className={styles['time']}>{getDateTimeString(comment.createdTime)}</span>
                </div>
                <p className={styles['comment']}>{comment.content}</p>
            </div>

        </div>
    )
}

export default TaskComment
interface ITaskCommentProps {
    comment: IComment
}