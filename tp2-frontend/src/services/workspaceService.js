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

export async function getWorkspaceList() {
    const response_http = await fetch(URL_API + "/api/workspace", {
        method: "GET",
        headers: buildHeaders(),
    })
    return parseResponse(response_http)
}

export async function getWorkspaceById(workspace_id) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}`, {
        method: "GET",
        headers: buildHeaders(),
    })
    return parseResponse(response_http)
}

export async function createWorkspace(workspace_data) {
    const response_http = await fetch(URL_API + "/api/workspace", {
        method: "POST",
        headers: buildHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(workspace_data),
    })
    return parseResponse(response_http)
}


export async function updateWorkspace(workspace_id, workspace_data) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}`, {
        method: "PUT",
        headers: buildHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(workspace_data),
    })
    return parseResponse(response_http)
}

export async function deleteWorkspace(workspace_id) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}`, {
        method: "DELETE",
        headers: buildHeaders(),
    })
    return parseResponse(response_http)
}

export async function inviteMember(workspace_id, invitation_data) {
    const response_http = await fetch(
        URL_API + `/api/workspace/${workspace_id}/members`,
        {
            method: "POST",
            headers: buildHeaders({ "Content-Type": "application/json" }),
            body: JSON.stringify(invitation_data),
        }
    )
    return parseResponse(response_http)
}