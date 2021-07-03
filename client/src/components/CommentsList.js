import React from 'react';


const CommentsList = ({ comments }) => {

    let content;
    const renderedComments = comments.map(comment => {
        if (comment.status === 'approved') {
            content = comment.content;
        }
        if (comment.status === 'pending') {
            content = 'this comment is waiting for moderation';
        }
        if (comment.status === 'rejected') {
            content = 'this comment was rejected';
        }
        return (
            <li key={comment.id}>
                {content}
            </li>
        )

    });
    return <ul>
        {renderedComments}
    </ul>



}
export default CommentsList;