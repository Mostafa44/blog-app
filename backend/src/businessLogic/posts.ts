import { BucketAccess } from './../dataLayer/bucketAccess';
//import { UpdatePostRequest } from './../../../client/src/types/UpdatePostRequest';
import * as uuid from 'uuid'

import { Post } from '../models/Post'
import { PostAccess } from '../dataLayer/postsAccess'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { parseUserId } from '../auth/utils'

const postAccess = new PostAccess();
const bucketAccess = new BucketAccess();

export async function getAllPosts(jwtToken: string): Promise<Post[]> {
    const userId = parseUserId(jwtToken);
    return postAccess.getAllPosts(userId)
}

export async function createPost(
    createPostRequest: CreatePostRequest,
    jwtToken: string
): Promise<Post> {

    const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)

    return await postAccess.createPost({
        id: itemId,
        userId: userId,
        title: createPostRequest.title,
        sendDate: createPostRequest.sendDate,
        attachmentUrl: createPostRequest.attachmentUrl
    })
}
// export async function updatePost(
//     updatePostRequest: UpdatePostRequest,
//     postItemId: string,
//     jwtToken: string
// ): Promise<Post> {
//     const userId = parseUserId(jwtToken);
//     return await postAccess.updatePost(postItemId, userId, {
//         title: updatePostRequest.title,
//         sendDate: updatePostRequest.sendDate,
//     })
// }
export async function deletePost(postItemId: string, jwtToken: string): Promise<Post> {
    const userId = parseUserId(jwtToken);
    return await postAccess.deletePost(postItemId, userId)
}
export async function postExists(postId: string): Promise<boolean> {
    const result = await postAccess.isPostExist(postId);
    return !!result
}
export async function addImageAttachment(postId: string, jwtToken: string): Promise<any> {
    const imageId = uuid.v4();
    const imageUrl = bucketAccess.getImageUrl(imageId);
    const userId = parseUserId(jwtToken);
    const newItem = await postAccess.addAttachment(postId, userId, imageUrl);
    const uploadUrl = bucketAccess.getPreSignedUrl(imageId);
    return {
        newItem, uploadUrl
    };
}