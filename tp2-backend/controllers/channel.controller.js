import { channelRepository } from "../repository/channel.repository.js"
import ServerError from "../helpers/error.helpers.js"

class ChannelController {
    async getAllByWorkspaceId(request, response) {
        const { workspace_id } = request.params
        const channels = await channelRepository.getAllByWorkspaceId(workspace_id)
        response.json({
            status: 200,
            ok: true,
            message: "Canales obtenidos con exito",
            data: { channels },
        })
    }

    async create(request, response) {
        const { name } = request.body
        const { workspace_id } = request.params

        const channel_created = await channelRepository.create(workspace_id, name)
        response.json({
            status: 201,
            ok: true,
            message: "Canal creado con exito",
            data: { channel_created },
        })
    }

    async update(request, response) {
        const { workspace_id, channel_id } = request.params
        const { name } = request.body

        if (!name || name.trim() === "") {
            throw new ServerError("El nombre es obligatorio", 400)
        }

        const updated = await channelRepository.updateName(channel_id, workspace_id, name.trim())

        if (!updated) {
            throw new ServerError("No existe ese canal", 404)
        }

        response.json({
            status: 200,
            ok: true,
            message: "Canal actualizado con exito",
            data: { channel_updated: updated },
        })
    }

    async remove(request, response) {
        const { workspace_id, channel_id } = request.params

        const deleted = await channelRepository.delete(channel_id, workspace_id)

        if (!deleted) {
            throw new ServerError("No existe ese canal", 404)
        }

        response.json({
            status: 200,
            ok: true,
            message: "Canal eliminado con exito",
            data: null,
        })
    }
}

const channelController = new ChannelController()
export { channelController }