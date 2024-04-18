const mongoose = require("mongoose");

const groupSchema = mongoose.Schema(
    {
        groupName: {
            type: String,
            required: [true, 'Tên Nhóm không tồn tại!'],
            unique: [true, "Tên Nhóm đã tồn tại!"]
        },
        groupCreateAt: {
            type: Date,
            required: [true, 'Thời gian tạo nhóm không tồn tại!'],
        }
    }
);


module.exports = mongoose.model("group", groupSchema);
