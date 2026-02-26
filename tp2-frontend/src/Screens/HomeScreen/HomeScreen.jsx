import React, { useContext } from 'react'
import { WorkspaceContext } from '../../Context/WorkspaceContext'
import { Link } from 'react-router-dom'

const HomeScreen = () => {
    const { workspace_list_loading, workspace_list_error, workspace_list } = useContext(WorkspaceContext)

    if (workspace_list_loading) {
        return <span>Loading...</span>
    }

    if (workspace_list_error) {
        return (
            <div>
                <h1>Bienvenido nuevamente</h1>
                <div>
                    <Link to="/create-workspace">Crear workspace</Link>
                </div>
                <span>{workspace_list_error.message}</span>
            </div>
        )
    }

    const workspaces = workspace_list?.data?.workspaces ?? []

    return (
    <div>
        <h1>Bienvenido nuevamente</h1>
        <div>
            <Link to="/create-workspace">Crear workspace</Link>
        </div>
        {workspaces.length > 0 && workspaces.map((workspace) => (
            <div key={workspace.workspace_id}>
                <Link to={`/workspace/${workspace.workspace_id}`}>
                {workspace.workspace_title}
                </Link>
                </div>
            ))
        }
        {workspaces.length === 0 && <span>No tienes workspaces</span>}
        </div>
    )
}

export default HomeScreen