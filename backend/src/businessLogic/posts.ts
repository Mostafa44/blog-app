import { BucketAccess } from './../dataLayer/bucketAccess';
//import { UpdatePostRequest } from './../../../client/src/types/UpdatePostRequest';

import * as uuid from 'uuid'

import { Post } from '../models/Post'
import { PostAccess } from '../dataLayer/postsAccess'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import { parseUserId } from '../auth/utils'
import { createLogger } from '../utils/logger'
const postAccess = new PostAccess();
const bucketAccess = new BucketAccess();

const logger = createLogger('posts');
export async function getAllPosts(jwtToken: string): Promise<Post[]> {
    const userId = parseUserId(jwtToken);
    logger.info('posts-get-all -> UserId');
    logger.info(userId);
    return postAccess.getAllPosts(userId)
}

export async function createPost(
    createPostRequest: CreatePostRequest,
    jwtToken: string
): Promise<Post> {

    const itemId = uuid.v4()
    const userId = parseUserId(jwtToken)
    logger.info('posts-create -> UserId', userId);
    return await postAccess.createPost({
        id: itemId,
        userId: userId,
        title: createPostRequest.title,
        modifiedAt: createPostRequest.modifiedAt,
        attachmentUrl: createPostRequest.attachmentUrl
    })
}
export async function updatePost(
    updatePostRequest: UpdatePostRequest,
    postItemId: string,
    jwtToken: string
): Promise<Post> {
    const userId = parseUserId(jwtToken);
    return await postAccess.updatePost(postItemId, userId, {
        title: updatePostRequest.title,
        modifiedAt: updatePostRequest.modifiedAt,
    })
}
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