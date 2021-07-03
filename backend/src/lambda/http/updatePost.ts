import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdatePostRequest } from '../../requests/UpdatePostRequest'
import { createLogger } from '../../utils/logger'
import { updatePost } from '../../businessLogic/posts';
const logger = createLogger('update-post');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const postId = event.pathParameters.postId
    const updatedPost: UpdatePostRequest = JSON.parse(event.body)
    updatedPost.modifiedAt = new Date().toString();
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    logger.info('Processing event: ', event);
    logger.info(postId);
    logger.info(updatedPost);
    const newItem = await updatePost(updatedPost, postId, jwtToken)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            newItem
        })
    }
}
