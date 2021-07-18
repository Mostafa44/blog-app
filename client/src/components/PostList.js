import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';


import { Button , Card} from 'semantic-ui-react'
import "semantic-ui-css/semantic.min.css";

const PostList = ({ postList }) => {

    const [posts, setPosts] = useState(Object.values(postList));
    const history = useHistory();
    const onEditButtonClick=(postId)=>{
        history.push(`/posts/${postId}/edit`)
    }
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

        return (<Card 
            key={post.id}
            >
            <Card.Content>
            <Card.Header >
                {post.title}

            </Card.Header>
            <Card.Description>{""}</Card.Description>
            </Card.Content>
            <Card.Content extra>
            
          <Button primary onClick={() => onEditButtonClick(post.id)}>
            Edit
          </Button>
         
            </Card.Content>
        </Card>);
    });
    return <div className="d-flex flex-row flex-wrap justify-content-between" >
        {renderedPosts}
    </div>
}

export default PostList;
