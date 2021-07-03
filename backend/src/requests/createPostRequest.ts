/**
 * Fields in a request to create a single Post item.
 */
export interface CreatePostRequest {
    title: string
    modifiedAt: string
    attachmentUrl?: string
}
