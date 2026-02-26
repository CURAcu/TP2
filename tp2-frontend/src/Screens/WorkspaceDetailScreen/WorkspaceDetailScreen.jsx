import React, { useContext, useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import useRequest from "../../hooks/useRequest"
import { AuthContext } from "../../Context/AuthContext"
import { getWorkspaceById, updateWorkspace, deleteWorkspace, inviteWorkspaceMember, getChannelsByWorkspaceId, createChannelByWorkspaceId, updateChannelByWorkspaceId, deleteChannelByWorkspaceId } from "../../services/workspaceService"

const WorkspaceDetailScreen = () => {
    const { workspace_id } = useParams()
    const navigate = useNavigate()
    const { authToken, clearSession } = useContext(AuthContext)

    const {
        loading: loadingDetail,
        response: responseDetail,
        error: errorDetail,
        sendRequest: sendDetailRequest,
    } = useRequest()

    const {
        loading: loadingUpdate,
        error: errorUpdate,
        sendRequest: sendUpdateRequest,
    } = useRequest()

    const {
        loading: loadingDelete,
        error: errorDelete,
        sendRequest: sendDeleteRequest,
    } = useRequest()

    const {
        loading: loadingInvite,
        error: errorInvite,
        sendRequest: sendInviteRequest,
    } = useRequest()

    const {
        loading: loadingChannels,
        response: responseChannels,
        error: errorChannels,
        sendRequest: sendChannelsRequest,
    } = useRequest()

    const {
        loading: loadingCreateChannel,
        error: errorCreateChannel,
        sendRequest: sendCreateChannelRequest,
    } = useRequest()

    const {
        loading: loadingUpdateChannel,
        error: errorUpdateChannel,
        sendRequest: sendUpdateChannelRequest,
    } = useRequest()

    const {
        loading: loadingDeleteChannel,
        error: errorDeleteChannel,
        sendRequest: sendDeleteChannelRequest,
    } = useRequest()

    const [workspace, setWorkspace] = useState(null)
    const [member, setMember] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [form, setForm] = useState({ title: "", description: "" })
    const [formErrors, setFormErrors] = useState({})
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState("Member")
    const [inviteOkMsg, setInviteOkMsg] = useState("")
    const [channels, setChannels] = useState([])
    const [newChannelName, setNewChannelName] = useState("")
    const [channelOkMsg, setChannelOkMsg] = useState("")
    const [editingChannelId, setEditingChannelId] = useState(null)
    const [editingChannelName, setEditingChannelName] = useState("")

    useEffect(() => {
        if (!authToken) return

        sendDetailRequest(
            () => getWorkspaceById(workspace_id, authToken),
            { onUnauthorized: () => clearSession() }
        )
    }, [workspace_id, authToken])

    useEffect(() => {
        if (!authToken) return

        sendChannelsRequest(
            () => getChannelsByWorkspaceId(workspace_id, authToken),
            { onUnauthorized: () => clearSession() }
        )
    }, [workspace_id, authToken])

    useEffect(() => {
        const list = responseChannels?.data?.channels
        if (!list) return
        setChannels(list)
    }, [responseChannels])

    useEffect(() => {
        const w = responseDetail?.data?.workspace
        const m = responseDetail?.data?.member
        if (!w) return

        setWorkspace(w)
        setMember(m)
        setForm({
            title: w.title ?? "",
            description: w.description ?? "",
        })
    }, [responseDetail])

    function startEdit() {
        if (!workspace) return
        setFormErrors({})
        setForm({
            title: workspace.title ?? "",
            description: workspace.description ?? "",
        })
        setIsEditing(true)
    }

    function cancelEdit() {
        setFormErrors({})
        setIsEditing(false)
        if (workspace) {
            setForm({
                title: workspace.title ?? "",
                description: workspace.description ?? "",
            })
        }
    }

    function onChange(e) {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    async function onSave(e) {
        e.preventDefault()

        const newErrors = {}

        if (form.title.trim() === "") newErrors.title = "El título es obligatorio."
        if (form.description.trim() === "") newErrors.description = "La descripción es obligatoria."
        if (form.description.length > 1000) newErrors.description = "Máximo 1000 caracteres."

        if (Object.keys(newErrors).length > 0) {
            setFormErrors(newErrors)
            return
        }

        const payload = {
            title: form.title,
            description: form.description,
        }

        await sendUpdateRequest(
            async () => {
                const r = await updateWorkspace(workspace_id, payload, authToken)
                const updated = r?.data?.workspace
                if (updated) {
                    setWorkspace(updated)
                    setIsEditing(false)
                }
            },
            { onUnauthorized: () => clearSession() }
        )
    }

    if (loadingDetail) return <span>Cargando...</span>

    const canEdit = member?.role === "Owner" || member?.role === "Admin"

    async function onDelete() {
        if (!canEdit) return

        const ok = window.confirm("Seguro que quieres borrar este workspace? Esta accion no se puede deshacer.")
        if (!ok) return

        await sendDeleteRequest(
            async () => {
                await deleteWorkspace(workspace_id, authToken)
                navigate("/home")
            },
            { onUnauthorized: () => clearSession() }
        )
    }

    async function onInviteMember(e) {
        e.preventDefault()
        setInviteOkMsg("")

        if (!canEdit) return

        const email = inviteEmail.trim()
        if (email === "") return

        await sendInviteRequest(
            async () => {
                await inviteWorkspaceMember(workspace_id, email, inviteRole, authToken)
                setInviteOkMsg("Invitacion enviada (si el email existe y no era miembro)")
                setInviteEmail("")
            },
            { onUnauthorized: () => clearSession() }
        )
    }

    async function onCreateChannel(e) {
        e.preventDefault()
        setChannelOkMsg("")

        if (!canEdit) return

        const name = newChannelName.trim()
        if (name === "") return

        await sendCreateChannelRequest(
            async () => {
                const r = await createChannelByWorkspaceId(workspace_id, name, authToken)
                const created = r?.data?.channel_created

                if (created) {
                    setChannels((prev) => [created, ...prev])
                    setNewChannelName("")
                    setChannelOkMsg("Canal creado.")
                }
            },
            { onUnauthorized: () => clearSession() }
        )
    }

    function startEditChannel(ch) {
        setEditingChannelId(ch._id || ch.channel_id)
        setEditingChannelName(ch.name || "")
    }

    function cancelEditChannel() {
        setEditingChannelId(null)
        setEditingChannelName("")
    }

    async function saveEditChannel(workspaceId, channelId) {
        const name = editingChannelName.trim()
        if (name === "") return

        await sendUpdateChannelRequest(
            async () => {
                const r = await updateChannelByWorkspaceId(workspaceId, channelId, name, authToken)
                const updated = r?.data?.channel_updated || r?.data?.channel || null

                setChannels((prev) =>
                    prev.map((ch) => {
                        const id = ch._id || ch.channel_id
                        if (id !== channelId) return ch
                        return updated ? updated : { ...ch, name }
                    })
                )

                cancelEditChannel()
            },
            { onUnauthorized: () => clearSession() }
        )
    }

async function onDeleteChannel(workspaceId, channelId) {
    if (!canEdit) return

    const ok = window.confirm("¿Borrar este canal? Esta acción no se puede deshacer.")
    if (!ok) return

    await sendDeleteChannelRequest(
    async () => {
        await deleteChannelByWorkspaceId(workspaceId, channelId, authToken)
        setChannels((prev) => prev.filter((ch) => (ch._id || ch.channel_id) !== channelId))
        },
        { onUnauthorized: () => clearSession() }
    )
}

    if (errorDetail) {
        return (
        <div>
            <Link to="/home">Volver</Link>
            <p>{errorDetail.message}</p>
        </div>
        )
    }

    if (!workspace) {
        return (
        <div>
            <Link to="/home">Volver</Link>
            <p>No se encontro el workspace.</p>
        </div>
        )
    }

    return (
        <div>
            <Link to="/home">Volver</Link>

            {!isEditing && (
                <>
                    <h1>{workspace.title}</h1>
                    <p>{workspace.description}</p>
                    <h3>Tu rol</h3>
                    <p>{member?.role}</p>

                    {canEdit && (
                        <>
                            <button
                                onClick={startEdit}
                                disabled={loadingDelete}>
                                Editar
                            </button>

                            <button
                                onClick={onDelete}
                                disabled={loadingDelete}>
                                {loadingDelete ? "Borrando..." : "Borrar"}
                            </button>

                            {errorDelete && <p>{errorDelete.message}</p>}
                        </>
                    )}

                    {canEdit && (
                        <div style={{ marginTop: 16 }}>
                            <h3>Invitar miembro</h3>

                            <form onSubmit={onInviteMember}>
                                <input
                                    placeholder="email@ejemplo.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    disabled={loadingInvite}
                                />

                                <select
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value)}
                                    disabled={loadingInvite}
                                >
                                    <option value="Member">User</option>
                                    <option value="Admin">Admin</option>
                                </select>

                                <button type="submit" disabled={loadingInvite || inviteEmail.trim() === ""}>
                                    {loadingInvite ? "Enviando..." : "Enviar invitación"}
                                </button>
                            </form>

                            {inviteOkMsg && <p>{inviteOkMsg}</p>}
                            {errorInvite && <p>{errorInvite.message}</p>}
                        </div>
                    )}

                    <div style={{ marginTop: 16 }}>
                        <h3>Canales</h3>

                        {canEdit && (
                            <form onSubmit={onCreateChannel} style={{ marginBottom: 12 }}>
                                <input
                                    placeholder="Nombre del canal"
                                    value={newChannelName}
                                    onChange={(e) => setNewChannelName(e.target.value)}
                                    disabled={loadingCreateChannel}
                                />

                                <button type="submit" disabled={loadingCreateChannel || newChannelName.trim() === ""}>
                                    {loadingCreateChannel ? "Creando..." : "Crear canal"}
                                </button>

                                {channelOkMsg && <p>{channelOkMsg}</p>}
                                {errorCreateChannel && <p>{errorCreateChannel.message}</p>}
                            </form>
                        )}

                        {loadingChannels && <span>Cargando canales...</span>}
                        {errorChannels && <p>{errorChannels.message}</p>}

                        {!loadingChannels && !errorChannels && channels.length === 0 && (
                            <span>No hay canales</span>
                        )}

                        {!loadingChannels && !errorChannels && channels.length > 0 && (
                            <div>
                                {channels.map((ch) => {
                                    const channelId = ch._id || ch.channel_id
                                    const isEditingThis = editingChannelId === channelId

                                    return (
                                        <div key={channelId} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                            {!isEditingThis && (
                                                <Link to={`/workspace/${workspace_id}/channels/${channelId}`}>
                                                    {ch.name}
                                                </Link>
                                            )}

                                            {isEditingThis && (
                                                <>
                                                    <input
                                                        value={editingChannelName}
                                                        onChange={(e) => setEditingChannelName(e.target.value)}
                                                        disabled={loadingUpdateChannel || loadingDeleteChannel}
                                                    />
                                                    <button
                                                        onClick={() => saveEditChannel(workspace_id, channelId)}
                                                        disabled={
                                                            loadingUpdateChannel ||
                                                            loadingDeleteChannel ||
                                                            editingChannelName.trim() === ""
                                                        }
                                                    >
                                                        {loadingUpdateChannel ? "Guardando..." : "Guardar"}
                                                    </button>
                                                    <button
                                                        onClick={cancelEditChannel}
                                                        disabled={loadingUpdateChannel || loadingDeleteChannel}
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}

                                            {canEdit && !isEditingThis && (
                                                <>
                                                    <button onClick={() => startEditChannel(ch)} disabled={loadingDeleteChannel}>
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => onDeleteChannel(workspace_id, channelId)}
                                                        disabled={loadingDeleteChannel}
                                                    >
                                                        {loadingDeleteChannel ? "Borrando..." : "Borrar"}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )
                                })}

                                {errorUpdateChannel && <p>{errorUpdateChannel.message}</p>}
                                {errorDeleteChannel && <p>{errorDeleteChannel.message}</p>}
                            </div>
                        )}
                    </div>
                </>
            )}

            {isEditing && (
                <form onSubmit={onSave}>
                    <h2>Editar workspace</h2>

                    <div>
                        <label>Titulo</label>
                        <input
                            name="title"
                            value={form.title}
                            onChange={onChange}
                            disabled={loadingUpdate}
                        />
                        {formErrors.title && <p>{formErrors.title}</p>}
                    </div>

                    <div>
                        <label>Descripción</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            disabled={loadingUpdate}
                        />
                        {formErrors.description && <p>{formErrors.description}</p>}
                    </div>

                    {errorUpdate && <p>{errorUpdate.message}</p>}

                    <button type="submit" disabled={loadingUpdate}>
                        {loadingUpdate ? "Guardando..." : "Guardar"}
                    </button>

                    <button type="button" onClick={cancelEdit} disabled={loadingUpdate}>
                        Cancelar
                    </button>
                </form>
            )}
        </div>
    )
}

export default WorkspaceDetailScreen