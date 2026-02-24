import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import useRequest from "../../hooks/useRequest"
import { getMessages, createMessage } from "../../services/messageService"

const ChannelMessagesScreen = () => {
    const { workspace_id, channel_id } = useParams()

    const listReq = useRequest()
    const createReq = useRequest()

    const [content, setContent] = useState("")

    useEffect(() => {
        listReq.sendRequest(() => getMessages(workspace_id, channel_id))
    }, [workspace_id, channel_id])

    function onSend(e) {
        e.preventDefault()
        if (!content.trim()) return

        createReq.sendRequest(async () => {
        await createMessage(workspace_id, channel_id, { content: content.trim() })
        setContent("")
        return await getMessages(workspace_id, channel_id)
        })
    }

    const messages =
        createReq.response?.data?.messages ||
        listReq.response?.data?.messages ||
        []

    return (
        <div>
        <h1>Mensajes</h1>

        <div style={{ marginBottom: 12 }}>
            <Link to={`/workspaces/${workspace_id}`}>Volver al workspace</Link>
        </div>

        {listReq.loading && !listReq.response && <span>Cargando mensajes...</span>}
        {listReq.error && <div style={{ color: "red" }}>{listReq.error.message}</div>}

        {!listReq.loading && listReq.response && messages.length === 0 && (
            <span>No hay mensajes todavía</span>
        )}

        {messages.length > 0 && (
            <div style={{ marginTop: 12 }}>
            {messages.map((m) => (
                <div key={m.message_id} style={{ marginBottom: 10 }}>
                <div>
                    <strong>{m.user?.name || m.user?.email || "Usuario"}</strong>
                </div>
                <div>{m.content}</div>
                </div>
            ))}
            </div>
        )}

        <hr style={{ margin: "16px 0" }} />

        <form onSubmit={onSend}>
            <div>
            <label>Nuevo mensaje:</label>
            <input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Escribí algo..."
            />
            </div>

            <div style={{ marginTop: 8 }}>
            <button type="submit" disabled={createReq.loading}>
                {createReq.loading ? "Enviando..." : "Enviar"}
            </button>
            </div>

            {createReq.error && (
            <div style={{ marginTop: 8, color: "red" }}>
                {createReq.error.message}
            </div>
            )}
        </form>
        </div>
    )
}

export default ChannelMessagesScreen