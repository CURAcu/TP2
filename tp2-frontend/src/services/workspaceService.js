import { ServerError } from "../utils/errorUtils"

const URL_API = import.meta.env.VITE_API_URL

export async function getWorkspaceList(authToken) {
    const response_http = await fetch(URL_API + "/api/workspace", {
        method: "GET",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    })

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function createWorkspace(workspace_data, authToken) {
    const response_http = await fetch(URL_API + "/api/workspace", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
        },
        body: JSON.stringify(workspace_data),
    })

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function getWorkspaceById(workspace_id, authToken) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    })

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response

}

export async function updateWorkspace(workspace_id, workspace_data, authToken) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
        },
        body: JSON.stringify(workspace_data),
    })

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function deleteWorkspace(workspace_id, authToken) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}`, {
        method: "DELETE",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    })

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function inviteWorkspaceMember(workspace_id, email, role, authToken) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}/members`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
        },
        body: JSON.stringify({ email, role }),
    })

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function getChannelsByWorkspaceId(workspace_id, authToken) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}/channels`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + authToken,
        },
    })

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function createChannelByWorkspaceId(workspace_id, name, authToken) {
    const response_http = await fetch(URL_API + `/api/workspace/${workspace_id}/channels`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authToken,
        },
        body: JSON.stringify({ name }),
    })

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function updateChannelByWorkspaceId(workspace_id, channel_id, name, authToken) {
    const response_http = await fetch(
        URL_API + `/api/workspace/${workspace_id}/channels/${channel_id}`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify({ name }),
        }
    )

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function deleteChannelByWorkspaceId(workspace_id, channel_id, authToken) {
    const response_http = await fetch(
        URL_API + `/api/workspace/${workspace_id}/channels/${channel_id}`,
        {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + authToken,
            },
        }
    )

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function getMessagesByChannelId(workspace_id, channel_id, authToken) {
    const response_http = await fetch(
        URL_API + `/api/workspace/${workspace_id}/channels/${channel_id}/messages`,
        {
            method: "GET",
            headers: {
                Authorization: "Bearer " + authToken,
            },
        }
    )

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}

export async function createMessage(workspace_id, channel_id, mensaje, authToken) {
    const response_http = await fetch(
        URL_API + `/api/workspace/${workspace_id}/channels/${channel_id}/messages`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + authToken,
            },
            body: JSON.stringify({ content: mensaje })
        }
    )

    const response = await response_http.json()

    if (!response.ok) {
        throw new ServerError(response.message, response.status || response_http.status)
    }

    return response
}