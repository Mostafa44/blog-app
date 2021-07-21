import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { deleteConnection } from '../../businessLogic/connections';


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Websocket disconnect', event)

  const connectionId = event.requestContext.connectionId
  const key = {
      id: connectionId
  }

  console.log('Removing item with key: ', key)

  await deleteConnection(connectionId);
  return {
    statusCode: 200,
    body: ''
  }
}
