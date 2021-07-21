import {Connection } from '../models/Connection';
import { ConnectionAccess } from '../dataLayer/connectionAccess'
import { createLogger } from '../utils/logger'


const logger = createLogger('connections');
const connectionAccess = new ConnectionAccess();


export async function createConnection(
    connectionId: string,
    timestamp: string
): Promise<Connection> {
    logger.info('connection-create -> connectionId', connectionId);
    return await connectionAccess.createConnection({
        id: connectionId,
        timestamp: timestamp,
    })
}

export async function deleteConnection(connectionId: string): Promise<Connection> {
    return await connectionAccess.deleteConnection(connectionId);
}