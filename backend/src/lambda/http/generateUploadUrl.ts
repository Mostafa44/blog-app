import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { addImageAttachment, } from '../../businessLogic/posts';
const logger = createLogger('generate-uploadurl');
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const postId = event.pathParameters.postId
  logger.info(postId);
  // Post: Return a presigned URL to upload a file for a Post item with the provided id

  //There is no need to validate the postId as we are sending the value from the frontend
  //and even in case this is to be checked we should be sending the userId as well
  //to check according to the schema we use

  // const validTodoId = await todoExists(postId);
  // if (!validTodoId) {
  //   return {
  //     statusCode: 404,
  //     body: JSON.stringify({
  //       error: 'Todo does not exist'
  //     })
  //   }
  // }
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  // const newImage = JSON.parse(event.body)
  console.log("just before addImageAttachment");
  const { newItem, uploadUrl } = await addImageAttachment(postId, jwtToken);
  console.log("just after addImageAttachment");
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: uploadUrl
    })
  }
}
