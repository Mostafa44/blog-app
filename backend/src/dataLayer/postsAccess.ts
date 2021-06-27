import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
const logger = createLogger('create-post');
const XAWS = AWSXRay.captureAWS(AWS) // debug tool to keep track of user requests
//const XAWS = AWS // debug tool to keep track of user requests

import { Post } from '../models/Post'
import { PostUpdate } from '../models/PostUpdate';
//import { throws } from 'assert';

export class PostAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly postsTable = process.env.POSTS_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX) {
    }

    async getAllPosts(userId: string): Promise<Post[]> {
        logger.info('Getting all posts')
        const params = {
            TableName: this.postsTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: "#userId = :userId",
            ExpressionAttributeNames: {
                "#userId": "userId",
            },
            ExpressionAttributeValues: {
                ':userId': userId,
            }
        };
        const result = await this.docClient.query(params).promise()

        const items = result.Items
        return items as Post[]
    }

    async createPost(post: Post): Promise<Post> {
        await this.docClient.put({
            TableName: this.postsTable,
            Item: post
        }).promise()

        return post
    }
    async updatePost(postItemId: string,
        userId: string,
        postUpdate: PostUpdate): Promise<Post> {
        let updateExpression = 'set';
        let ExpressionAttributeNames = {};
        let ExpressionAttributeValues = {};
        for (const property in postUpdate) {

            updateExpression += ` #${property} = :${property} ,`;
            ExpressionAttributeNames['#' + property] = property;
            ExpressionAttributeValues[':' + property] = postUpdate[property];
        }


        logger.info(ExpressionAttributeNames);


        updateExpression = updateExpression.slice(0, -1);
        logger.info(updateExpression);
        const params = {
            TableName: this.postsTable,
            Key: {
                id: postItemId,
                userId: userId
            },
            UpdateExpression: updateExpression,
            ExpressionAttributeNames: ExpressionAttributeNames,
            ExpressionAttributeValues: ExpressionAttributeValues,
            ReturnValues: 'ALL_NEW'
        };
        const result = await this.docClient.update(params).promise();
        return result.Attributes as Post;
    }
    async deletePost(postId: string, userId: string): Promise<Post> {
        const itemToBeDeleted = await this.docClient.delete({
            TableName: this.postsTable,
            Key: {
                id: postId,
                userId: userId
            },
            ReturnValues: 'ALL_OLD'
        }).promise();
        return itemToBeDeleted.Attributes as Post;
    }
    async isPostExist(postId: string): Promise<Post> {
        console.log("just before searching for the post item")
        const result = await this.docClient
            .get({
                TableName: this.postsTable,
                Key: {
                    id: postId
                }
            })
            .promise()
        return result.Item as Post;
    }
    async addAttachment(postId: string,
        userId: string, imageUrl: string) {
        const params = {
            TableName: this.postsTable,
            Key: {
                id: postId,
                userId: userId
            },
            UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
            ExpressionAttributeNames: { '#attachmentUrl': 'attachmentUrl' },
            ExpressionAttributeValues: { ':attachmentUrl': imageUrl, },
            ReturnValues: 'ALL_NEW'
        };

        const result = await this.docClient.update(params).promise();
        return result.Attributes as Post;
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

