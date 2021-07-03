import React, { useState } from 'react';
import axios from 'axios';

const CommentCreate = ({ postId }) => {
    const [content, setContent] = useState('');
    const onChangeHandler = (e) => {
        setContent(e.target.value);
    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        await axios.post(`http://posts.com/posts/${postId}/comments`, { content });
        setContent('');
    }
    return <div>
        <form onSubmit={onSubmitHandler}>
            <div className="form-group">
                <label>New Comment</label>
                <input value={content} onChange={onChangeHandler} className="form-control" />
                <button className="btn btn-primary" >Submit</button>
            </div>
        </form>
    </div>
}

export default CommentCreate;