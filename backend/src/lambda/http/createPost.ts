import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreatePostRequest } from '../../requests/CreatePostRequest'
import { createLogger } from '../../utils/logger'
import { createPost } from '../../businessLogic/posts';
const logger = createLogger('create-post');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing event: ', event);
    const newPost: CreatePostRequest = JSON.parse(event.body)
    newPost.modifiedAt = new Date().toString();
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]

    // TODO: Implement creating a new TODO item
    const newItem = await createPost(newPost, jwtToken)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            newItem
        })
    }
}
