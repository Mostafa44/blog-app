import React , {useContext, useState} from 'react';
import UserContext from '../context/userContext';
import { Form, Button } from 'semantic-ui-react'
import {getUploadUrl, uploadFile} from '../api/posts-apis';
 

const EditPost=(props)=>{
    const userContext = useContext(UserContext);
    const {postId}= props.match.params;
    const [file, setFile]= useState(undefined);
    const [isUploading, setIsUploading]= useState(false);
    const userIdToken=  userContext.idToken ? userContext.idToken : "";
    const handleFileChange = (event) => {
        const files = event.target.files
        if (!files) return
        setFile(files[0]);
      }
    const handleSubmit = async (event) => {
        event.preventDefault()
    
        try {
          if (!file) {
            alert('File should be selected')
            return
          }
    
         // this.setUploadState(UploadState.FetchingPresignedUrl)
          const uploadUrl = await getUploadUrl(userIdToken, postId)
    
          setIsUploading(true);
          await uploadFile(uploadUrl, file)
    
          alert('File was uploaded!')
        } catch (e) {
          alert('Could not upload a file: ' + e.message)
        } finally {
            setIsUploading(false);
        }
      }
      const   renderButton=()=> {

        return (
          <div>
            {isUploading && <p>Uploading file</p>}
            <Button
              loading={isUploading}
              type="submit"
            >
              Upload
            </Button>
          </div>
        )
      }
      return (
        <div>
          <h1>Upload new file</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Field>
              <label>File</label>
              <input
                type="file"
                accept="image/*"
                placeholder="Image to upload"
                onChange={handleFileChange}
              />
            </Form.Field>
  
            {renderButton()}
          </Form>
        </div>
      )
}

export default EditPost;