import React from "react";

//import contentData from "../utils/content-data";
//import { Col, Row } from "react-bootstrap";
import PostCreate from './PostCreate';
import PostList from './PostList'

const Content = () => (
  <div className="container">
    <h1>Create Post</h1>
    <PostCreate />
    <hr />
    <h2>Posts</h2>
    <PostList />
  </div>
);

export default Content;
