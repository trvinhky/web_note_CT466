const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const groupInfoSchema = mongoose.Schema(
    {
        groupId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Id nhóm không tồn tại!'],
            ref: 'group',
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Id người dùng không tồn tại!'],
            ref: 'user',
        },
        groupInfoAdmin: {
            type: Boolean,
            default: false,
        },
        groupInfoStatus: {
            type: Boolean,
            default: false,
        },
    }
)

module.exports = mongoose.model("groupInfo", groupInfoSchema);