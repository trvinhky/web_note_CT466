const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workSchema = mongoose.Schema(
    {
        workTitle: {
            type: String,
            required: [true, 'Tiêu đề công việc không tồn tại!'],
        },
        workDescription: {
            type: String,
            required: [true, 'Nội dung công việc không tồn tại!'],
        },
        workDateStart: {
            type: Date,
            required: [true, 'Thời gian bắt đầu không tồn tại!'],
        },
        workDateEnd: {
            type: Date,
            required: [true, 'Thời gian kết thúc không tồn tại!'],
            primaryKey: true
        },
        groupId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Id nhóm không tồn tại!'],
            ref: 'group',
        },
    }
);

// Định nghĩa validator cho workDateStart và workDateEnd
workSchema.path("workDateStart").validate(function (value) {
    return value < this.workDateEnd;
}, "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!");

module.exports = mongoose.model("work", workSchema);
