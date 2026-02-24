import React, { useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import useRequest from "../../hooks/useRequest"
import { getWorkspaceById, updateWorkspace, deleteWorkspace, inviteMember,} from "../../services/workspaceService"
import { getChannels, createChannel } from "../../services/channelService"

const WorkspaceDetailScreen = () => {
    const { workspace_id } = useParams()
    const navigate = useNavigate()

    const workspaceReq = useRequest()
    const channelsReq = useRequest()
    const createChannelReq = useRequest()
    const inviteReq = useRequest()
    const deleteReq = useRequest()
    const updateReq = useRequest()

    const [editMode, setEditMode] = useState(false)
    const [formState, setFormState] = useState({
        workspace_title: "",
        workspace_description: "",
    })

    const [inviteState, setInviteState] = useState({
        email: "",
        role: "Member",
    })

    const [newChannelName, setNewChannelName] = useState("")

    useEffect(() => {
        workspaceReq.sendRequest(() => getWorkspaceById(workspace_id))
        channelsReq.sendRequest(() => getChannels(workspace_id))
    }, [workspace_id])

    useEffect(() => {
        const workspace = workspaceReq.response?.data?.workspace
        if (workspace) {
        setFormState({
            workspace_title: workspace.workspace_title || "",
            workspace_description: workspace.workspace_description || "",
        })
        }
    }, [workspaceReq.response])

    function onChangeEdit(e) {
        setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function onChangeInvite(e) {
        setInviteState((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function onSave(e) {
        e.preventDefault()
        updateReq.sendRequest(async () => {
        await updateWorkspace(workspace_id, formState)
        return await getWorkspaceById(workspace_id)
        })
        setEditMode(false)
    }

    function onDelete() {
        const ok = confirm("Eliminar workspace? Esto no se puede deshacer.")
        if (!ok) return

        deleteReq.sendRequest(async () => {
        const r = await deleteWorkspace(workspace_id)
        navigate("/home")
        return r
        })
    }

    function onInvite(e) {
        e.preventDefault()
        inviteReq.sendRequest(async () => {
        const r = await inviteMember(workspace_id, inviteState)
        setInviteState({ email: "", role: "Member" })
        return r
        })
    }

    function onCreateChannel(e) {
        e.preventDefault()
        if (!newChannelName.trim()) return

        createChannelReq.sendRequest(async () => {
        await createChannel(workspace_id, { name: newChannelName.trim() })
        setNewChannelName("")
        return await getChannels(workspace_id)
        })
    }

    const workspaceLoading = workspaceReq.loading && !workspaceReq.response
    if (workspaceLoading) return <span>Loading...</span>

    const workspace = workspaceReq.response?.data?.workspace
    const channels = channelsReq.response?.data?.channels || createChannelReq.response?.data?.channels || []

    return (
        <div>
        <h1>Workspace</h1>

        <div style={{ marginBottom: 12 }}>
            <Link to="/home">Volver</Link>
        </div>

        {workspaceReq.error && <span style={{ color: "red" }}>{workspaceReq.error.message}</span>}

        {!workspace && !workspaceReq.loading && <span>No se encontró el workspace</span>}

        {workspace && (
            <>
            <div style={{ marginBottom: 12 }}>
                <strong>ID:</strong> {workspace.workspace_id}
            </div>

            {!editMode ? (
                <>
                <div>
                    <strong>Título:</strong> {workspace.workspace_title}
                </div>
                <div>
                    <strong>Descripción:</strong> {workspace.workspace_description}
                </div>

                <div style={{ marginTop: 12 }}>
                    <button onClick={() => setEditMode(true)}>Editar</button>{" "}
                    <button onClick={onDelete} style={{ color: "red" }} disabled={deleteReq.loading}>
                    {deleteReq.loading ? "Eliminando..." : "Eliminar"}
                    </button>
                </div>

                {deleteReq.error && (
                    <div style={{ marginTop: 8 }}>
                    <span style={{ color: "red" }}>{deleteReq.error.message}</span>
                    </div>
                )}
                </>
            ) : (
                <form onSubmit={onSave} style={{ marginTop: 12 }}>
                <div>
                    <label>Título:</label>
                    <input
                    name="workspace_title"
                    value={formState.workspace_title}
                    onChange={onChangeEdit}
                    />
                </div>
                <div>
                    <label>Descripción:</label>
                    <input
                    name="workspace_description"
                    value={formState.workspace_description}
                    onChange={onChangeEdit}
                    />
                </div>

                <div style={{ marginTop: 12 }}>
                    <button type="submit" disabled={updateReq.loading}>
                    {updateReq.loading ? "Guardando..." : "Guardar"}
                    </button>{" "}
                    <button type="button" onClick={() => setEditMode(false)}>
                    Cancelar
                    </button>
                </div>

                {updateReq.error && (
                    <div style={{ marginTop: 8 }}>
                    <span style={{ color: "red" }}>{updateReq.error.message}</span>
                    </div>
                )}
                </form>
            )}

            <hr style={{ margin: "16px 0" }} />

            <h2>Canales</h2>

            {channelsReq.loading && !channelsReq.response && <span>Cargando canales...</span>}
            {channelsReq.error && <div style={{ color: "red" }}>{channelsReq.error.message}</div>}

            {((channelsReq.response && channels.length === 0) && !channelsReq.loading) && (
                <span>No hay canales todavía</span>
            )}

            {channels.length > 0 && (
                <div style={{ marginTop: 8 }}>
                    {channels.map((c) => (
                        <div key={c.channel_id}>
                            <Link to={`/workspaces/${workspace_id}/channels/${c.channel_id}`}>
                            #{c.name}
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={onCreateChannel} style={{ marginTop: 12 }}>
                <div>
                <label>Nuevo canal:</label>
                <input
                    value={newChannelName}
                    onChange={(e) => setNewChannelName(e.target.value)}
                    placeholder="general"
                />
                </div>
                <div style={{ marginTop: 8 }}>
                <button type="submit" disabled={createChannelReq.loading}>
                    {createChannelReq.loading ? "Creando..." : "Crear canal"}
                </button>
                </div>

                {createChannelReq.error && (
                <div style={{ marginTop: 8, color: "red" }}>
                    {createChannelReq.error.message}
                </div>
                )}
            </form>

            <hr style={{ margin: "16px 0" }} />

            <h2>Invitar miembro</h2>
            <form onSubmit={onInvite}>
                <div>
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    value={inviteState.email}
                    onChange={onChangeInvite}
                    required
                />
                </div>
                <div>
                <label>Rol:</label>
                <select name="role" value={inviteState.role} onChange={onChangeInvite}>
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                    <option value="Owner">Owner</option>
                </select>
                </div>

                <div style={{ marginTop: 12 }}>
                <button type="submit" disabled={inviteReq.loading}>
                    {inviteReq.loading ? "Enviando..." : "Enviar invitación"}
                </button>
                </div>

                {inviteReq.error && (
                <div style={{ marginTop: 8, color: "red" }}>
                    {inviteReq.error.message}
                </div>
                )}
            </form>
            </>
        )}
        </div>
    )
}

export default WorkspaceDetailScreen