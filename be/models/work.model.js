const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workSchema = mongoose.Schema(
    {
        workTitle: {
            type: String,
            required: [true, 'Tiêu đề công việc không tồn tại!'],
        },
        workDateStart: {
            type: Date,
            required: [true, 'Thời gian bắt đầu không tồn tại!'],
        },
        workDateEnd: {
            type: Date,
            required: [true, 'Thời gian kết thúc không tồn tại!'],
        },
        markId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Id nhãn không tồn tại!'],
            ref: 'mark'
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: [true, 'Id người dùng không tồn tại!'],
            ref: 'user'
        }
    }
);

// Định nghĩa validator cho workDateStart và workDateEnd
workSchema.path("workDateStart").validate(function (value) {
    return value < this.workDateEnd;
}, "Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc!");

module.exports = mongoose.model("work", workSchema);
