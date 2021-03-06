import React, { useEffect, useState, useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
//import contentData from "../utils/content-data";
//import { Col, Row } from "react-bootstrap";
import PostCreate from './PostCreate';
import PostList from './PostList'
import GuestGreeting from "./GuestGreeting";
import { createPost, getPosts } from '../api/posts-apis'
import UserContext from '../context/userContext';

const Content = () => {
  const { getIdTokenClaims, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [idToken, setIdToken] = useState('');
  const [posts, setPosts] = useState({});
  const userContext = useContext(UserContext);
  const onSubmitHandler = async (e, title) => {
    e.preventDefault();
    console.log("submitted");
    const resPost = await createPost(idToken, { title });
    console.log(resPost);

    const allPosts = await getPosts(idToken);
    setPosts(allPosts);
    console.log(posts);
    //setTitle('');
  }


  useEffect(() => {

    const getUserAccessToken = async () => {
      const domain = process.env.REACT_APP_AUTH0_DOMAIN;

      try {
        const accessToken = await getAccessTokenSilently({
          // audience: `https://${domain}/`,
          // scope: "read:current_user",
        });
        console.log('Access token: ', accessToken);
        const claims = await getIdTokenClaims();
        console.log('Id token: ', claims.__raw);
        setIdToken(claims.__raw);
        userContext.onLoggedIn(claims.__raw);
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserAccessToken();

  }, [isAuthenticated]);
  useEffect(() => {
    const fetchPosts = async () => {
      if (idToken && idToken !== '') {
        console.log('inside the fetch');
        console.log(idToken);
        const res = await getPosts(idToken);
        //console.log(res.data);
        setPosts(res);
      } else {
        setPosts({})
      }
    }
    fetchPosts();
  }, [idToken])
  if (isAuthenticated) {
    return (<div className="container">
      <h1>Create Post</h1>
      <PostCreate onPostubmit={onSubmitHandler} />
      <hr />
      <h2>Posts</h2>
      <PostList postList={posts} />
    </div>);
  } else {
    return <GuestGreeting />
  }
};

export default Content;
