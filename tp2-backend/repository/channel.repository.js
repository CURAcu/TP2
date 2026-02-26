import Channel from "../models/Channels.model.js"

class ChannelRepository {
    async create(workspace_id, name) {
        return await Channel.create({ name: name, fk_id_workspace: workspace_id })
    }

    async getAllByWorkspaceId(workspace_id) {
        return await Channel.find({ fk_id_workspace: workspace_id, active: true })
    }

    async getByIdAndWorkspaceId(channel_id, workspace_id) {
        return await Channel.findOne({ _id: channel_id, fk_id_workspace: workspace_id, active: true })
    }

    async updateName(channel_id, workspace_id, name) {
        return await Channel.findOneAndUpdate(
            { _id: channel_id, fk_id_workspace: workspace_id, active: true },
            { name },
            { new: true }
        )
    }

    async delete(channel_id, workspace_id) {
        return await Channel.findOneAndUpdate(
            { _id: channel_id, fk_id_workspace: workspace_id, active: true },
            { active: false },
            { new: true }
        )
    }
}

const channelRepository = new ChannelRepository()
export { channelRepository }