const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workerSchema = mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Id người dùng không tồn tại!'],
            primaryKey: true,
            ref: 'user'
        },
        workId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Id công việc không tồn tại!'],
            primaryKey: true,
            ref: 'work'
        },
        workerCreateAt: {
            type: Date,
            required: [true, 'Thời gian tạo không tồn tại!'],
        },
        workerNote: {
            type: String,
        },
        workerStatus: {
            type: Number,
            enum: [0, 1, 2], // 0 - chưa xác nhận, 1 - đã xác nhận, 2 - hủy
            default: 0,
        }
    }
);
module.exports = mongoose.model("worker", workerSchema);
