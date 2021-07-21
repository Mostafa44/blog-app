import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
const logger = createLogger('conenction-access');
const XAWS = AWSXRay.captureAWS(AWS) 
import { Connection } from '../models/Connection'


export class ConnectionAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly connectionsTable = process.env.CONNECTIONS_TABLE,
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
