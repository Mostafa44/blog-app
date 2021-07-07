import { apiEndpoint } from '../config'
import Axios from 'axios'

export async function getPosts(idToken) {
    console.log('Fetching posts')

    const response = await Axios.get(`${apiEndpoint}/posts`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
    })
    console.log('Posts:', response.data)
    console.log(response.data.posts);
    return response.data.posts
}

export async function createPost(
    idToken,
    newPost
) {
    const response = await Axios.post(`${apiEndpoint}/posts`, JSON.stringify(newPost), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.newItem
}

export async function patchPost(
    idToken,
    postId,
    updatedPost,
) {
    await Axios.put(`${apiEndpoint}/posts/${postId}`, JSON.stringify(updatedPost), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
}

export async function deletePost(
    idToken,
    postId
) {
    await Axios.delete(`${apiEndpoint}/posts/${postId}`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
}

export async function getUploadUrl(
    idToken,
    postId
) {
    const response = await Axios.post(`${apiEndpoint}/posts/${postId}/attachment`, '', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        }
    })
    return response.data.uploadUrl
}

export async function uploadFile(uploadUrl, file) {
    await Axios.put(uploadUrl, file)
}
