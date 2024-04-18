const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workInfoSchema = mongoose.Schema(
    {
        workId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Id công việc không tồn tại!'],
            ref: 'work',
        },
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
        workInfoStatus: {
            type: Boolean,
            default: false,
        },
    }
)

module.exports = mongoose.model("workInfo", workInfoSchema);