import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { sendMessageToClient, getAllConnections } from '../../businessLogic/connections';

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    console.log('Processing events batch from DynamoDB', JSON.stringify(event))

    for (const record of event.Records) {
        console.log('Processing record', JSON.stringify(record))
        if (record.eventName !== 'REMOVE') {
          continue
        }
        const oldItem= record.dynamodb.OldImage;
        const postId= oldItem.id.S;
        console.log(postId);

        // const body = {
        //     id: oldItem.id.S,
        //     userId: oldItem.userId.S,
        //     title: oldItem.title.S,
        //     modifiedAt: oldItem.modifiedAt.S
        //   }
      
       //console.log(body);
       const payload={message: `The post with ${oldItem.id.S} and title  ${oldItem.title.S} was removed , it belongs to the user with user id of ${oldItem.userId.S}`}
       const connections = await getAllConnections();
       for (const connection of connections) {
        const connectionId = connection.id
        await sendMessageToClient(connectionId, payload)
    }
    }

}