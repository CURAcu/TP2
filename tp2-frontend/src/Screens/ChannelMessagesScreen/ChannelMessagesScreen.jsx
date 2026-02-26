import React, { useContext, useEffect, useMemo, useRef, useState } from "react"
import { Link, useParams } from "react-router-dom"
import useRequest from "../../hooks/useRequest"
import { AuthContext } from "../../Context/AuthContext"
import { getMessagesByChannelId, createMessage } from "../../services/workspaceService"

const ChannelMessagesScreen = () => {
    const { workspace_id, channel_id } = useParams()
    const { authToken, clearSession } = useContext(AuthContext)

    const { loading, response, error, sendRequest } = useRequest()

    const {
        loading: loadingCreate,
        error: errorCreate,
        sendRequest: sendCreateRequest,
    } = useRequest()

    const [messages, setMessages] = useState([])
    const [text, setText] = useState("")

    const bottomRef = useRef(null)

    useEffect(() => {
        if (!authToken) return

        sendRequest(
            () => getMessagesByChannelId(workspace_id, channel_id, authToken),
            { onUnauthorized: () => clearSession() }
        )
    }, [workspace_id, channel_id, authToken])

    useEffect(() => {
        const list = response?.data?.messages ?? []
        setMessages(list)
    }, [response])

    const orderedMessages = useMemo(() => {
        if (messages.length === 0) return []
        const hasCreatedAt = !!messages[0]?.createdAt
        if (!hasCreatedAt) return messages
        return [...messages].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        )
    }, [messages])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [orderedMessages.length])

    async function onSend(e) {
        e.preventDefault()
        const mensaje = text.trim()
        if (!mensaje) return

        await sendCreateRequest(
            async () => {
                const r = await createMessage(workspace_id, channel_id, mensaje, authToken)
                const created = r?.data?.message_created || r?.data?.message || null

                if (created) {
                    setMessages((prev) => [...prev, created])
                } else {
                    setMessages((prev) => [...prev, { _id: Date.now().toString(), mensaje }])
                }

                setText("")
            },
        { onUnauthorized: () => clearSession() }
        )
    }

    return (
        <div>
            <Link to={`/workspace/${workspace_id}`}>Volver al workspace</Link>

            <h2>Mensajes</h2>

            {loading && <p>Cargando mensajes...</p>}
            {error && <p>{error.message}</p>}

            {!loading && !error && orderedMessages.length === 0 && <p>No hay mensajes</p>}

            {!loading && !error && orderedMessages.length > 0 && (
                <div style={{ maxHeight: 400, overflowY: "auto", border: "1px solid #ddd", padding: 12 }}>
                    {orderedMessages.map((msg) => {
                        const id = msg._id || msg.id
                        const user = msg?.fk_workspace_member_id?.fk_id_user
                        const username = user?.username || user?.email || "Usuario"

                        return (
                            <div key={id} style={{ marginBottom: 10 }}>
                                <strong>{username}:</strong> <span>{msg.mensaje}</span>
                            </div>
                        )
                    })}
                    <div ref={bottomRef} />
                </div>
            )}

            <form onSubmit={onSend} style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribí un mensaje..."
                    disabled={loadingCreate}
                    style={{ flex: 1 }}
                />
                <button type="submit" disabled={loadingCreate || text.trim() === ""}>
                    {loadingCreate ? "Enviando..." : "Enviar"}
                </button>
                {errorCreate && <p>{errorCreate.message}</p>}
            </form>

            {errorCreate && <p>{errorCreate.message}</p>}
        </div>
    )
}

export default ChannelMessagesScreen