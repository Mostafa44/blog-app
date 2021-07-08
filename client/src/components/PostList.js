import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentsList from './CommentsList';
import { getPosts } from '../api/posts-apis'

const PostList = ({ postList }) => {

    const [posts, setPosts] = useState(Object.values(postList));
    useEffect(() => {
        setPosts(Object.values(postList));
        console.log("inside the post-list");
        console.log(postList);
    }, [postList])

    // useEffect(() => {
    //     console.log("inside the postslist");
    //     console.log(authToken);
    //     console.log(posts);
    //     fetchPosts();

    // }, [authToken])
    const renderedPosts = posts.map(post => {

        return (<div className="Card"
            key={post.id}
            style={{ width: '30%', marginBottom: '20px' }}>
            <div className="card-body">
                <h3>{post.title}</h3>

            </div>
        </div>);
    });
    return <div className="d-flex flex-row flex-wrap justify-content-between" >
        {renderedPosts}
    </div>
}

export default PostList;
