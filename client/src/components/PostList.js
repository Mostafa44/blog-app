import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../context/userContext';
import { useHistory } from 'react-router-dom';


import { deletePost } from '../api/posts-apis'
import { Button , Card} from 'semantic-ui-react'
import "semantic-ui-css/semantic.min.css";

const PostList = ({ postList }) => {

    const [posts, setPosts] = useState(Object.values(postList));
    const userContext = useContext(UserContext);
    const history = useHistory();
    const userIdToken=  userContext.idToken ? userContext.idToken : "";
    const onEditButtonClick=(postId)=>{
        history.push(`/posts/${postId}/edit`)
    }
    const onPostDelete = async (postId) => {
        try {
          await deletePost(userIdToken, postId);
          setPosts(posts.filter(post => post.id != postId));
        } catch {
          alert('Todo deletion failed')
        }
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
            <div className='ui two buttons'>
          <Button  basic color='green' onClick={() => onEditButtonClick(post.id)}>
            Edit
          </Button>
          <Button basic color='red' onClick={()=>onPostDelete(post.id) }>
            Delete
          </Button>
         </div>
            </Card.Content>
        </Card>);
    });
    return <div className="d-flex flex-row flex-wrap justify-content-between" >
        {renderedPosts}
    </div>
}

export default PostList;
