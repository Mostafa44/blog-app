import React , {useContext} from 'react';
import UserContext from '../context/userContext';
import { Form, Button } from 'semantic-ui-react'
 

const EditPost=()=>{
    const userContext = useContext(UserContext);
    return (
        <div>
          Edit Post {userContext.idToken ? userContext.idToken : ""}
        </div>
      );
}

export default EditPost;