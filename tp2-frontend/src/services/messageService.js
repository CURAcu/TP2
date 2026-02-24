import { ServerError } from "../utils/errorUtils"

const URL_API = import.meta.env.VITE_API_URL

function buildHeaders(extra = {}) {
    return {
        "x-api-key": import.meta.env.VITE_API_KEY,
        "Authorization": "Bearer " + localStorage.getItem("auth_token"),
        ...extra,
    }
}

async function parseResponse(response_http) {
    const response = await response_http.json()
    if (!response.ok) {
        throw new ServerError(response.message, response.status)
    }
    return response
}

export async function getMessages(workspace_id, channel_id) {
    const response_http = await fetch(
        URL_API + `/api/workspace/${workspace_id}/channels/${channel_id}/messages`,
        {
            method: "GET",
            headers: buildHeaders(),
        }
    )
    return parseResponse(response_http)
}

export async function createMessage(workspace_id, channel_id, message_data) {
    const response_http = await fetch(
        URL_API + `/api/workspace/${workspace_id}/channels/${channel_id}/messages`,
        {
            method: "POST",
            headers: buildHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(message_data), // { content: "..." }
        }
    )
    return parseResponse(response_http)
}