
import React, { useState } from 'react';
import axios from 'axios';

const PostCreate = () => {
    const [title, setTitle] = useState("");
    const onChangeHandler = (e) => {
        setTitle(e.target.value);

    }
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        console.log("submitted");
        await axios.post('http://posts.com/posts/create', { title });
        setTitle('');
    }
    return <div >
        <form onSubmit={onSubmitHandler}>
            <div className="form-group" >
                <label>Title</label>
                <input value={title} onChange={onChangeHandler} className="form-control" />
            </div>
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>

}
export default PostCreate;