import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { createConnection } from '../../businessLogic/connections';



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Websocket connect', event)

  const connectionId = event.requestContext.connectionId
  const timestamp = new Date().toISOString()



 const item= await createConnection(connectionId, timestamp);
 console.log('storing item', item);

  return {
    statusCode: 200,
    body: ''
  }
}
