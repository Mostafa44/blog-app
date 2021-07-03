import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
//import contentData from "../utils/content-data";
//import { Col, Row } from "react-bootstrap";
import PostCreate from './PostCreate';
import PostList from './PostList'
import GuestGreeting from "./GuestGreeting";

const Content = () => {
  const { getIdTokenClaims, isAuthenticated, getAccessTokenSilently } = useAuth0();

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
      } catch (e) {
        console.log(e.message);
      }
    };
    getUserAccessToken();
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (<div className="container">
      <h1>Create Post</h1>
      <PostCreate />
      <hr />
      <h2>Posts</h2>
      <PostList />
    </div>);
  } else {
    return <GuestGreeting />
  }
};

export default Content;
