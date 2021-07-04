import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { deletePost } from '../../businessLogic/posts';
import { createLogger } from '../../utils/logger'

const logger = createLogger('delete-post');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const postId = event.pathParameters.postId
    logger.info('deleting a post with id ', postId);
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    // TODO: Remove a TODO item by id

    const post = await deletePost(postId, jwtToken)
    return {
        statusCode: 202,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            post
        })
    }
}
