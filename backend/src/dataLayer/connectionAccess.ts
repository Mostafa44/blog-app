import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
const logger = createLogger('conenction-access');
const XAWS = AWSXRay.captureAWS(AWS) 
import { Connection , Payload} from '../models/Connection'

const stage = process.env.STAGE
const apiId = process.env.API_ID

const connectionParams = {
  apiVersion: "2018-11-29",
  endpoint: `${apiId}.execute-api.eu-west-3.amazonaws.com/${stage}`
}


export class ConnectionAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly connectionsTable = process.env.CONNECTIONS_TABLE,
        private readonly apiGateway = new AWS.ApiGatewayManagementApi(connectionParams)
        ) {
    }

    async createConnection(connection: Connection): Promise<Connection> {
        await this.docClient.put({
            TableName: this.connectionsTable,
            Item: connection
        }).promise()

        return connection
    }
  
    async deleteConnection(connectionId: string): Promise<Connection> {
        const itemToBeDeleted = await this.docClient.delete({
            TableName: this.connectionsTable,
            Key: {
                id: connectionId,
               
            },
            ReturnValues: 'ALL_OLD'
        }).promise();
        return itemToBeDeleted.Attributes as Connection;
    }
    async getAllConnections():Promise<Connection[]>{
        logger.info('Getting all connections');
        const result= await this.docClient.scan({
            TableName: this.connectionsTable
        }).promise();
        const items = result.Items
        return items as Connection[]
    }

    async sendMessageToConnection(connectionId:string, payload: Payload){
        try {
            console.log('Sending message to a connection', connectionId)
            console.log('the api-id is ', apiId)
            await this.apiGateway.postToConnection({
              ConnectionId: connectionId,
              Data: JSON.stringify(payload),
            }).promise()
        
          } catch (e) {
            console.log('Failed to send message', JSON.stringify(e))
            if (e.statusCode === 410) {
              console.log('Stale connection')
        
            await this.deleteConnection(connectionId);
        
            }
          }
    }
}
function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.info('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}
