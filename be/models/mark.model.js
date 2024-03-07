const mongoose = require("mongoose");

const markSchema = mongoose.Schema(
    {
        markName: {
            type: String,
            required: [true, 'Tên nhãn không tồn tại!'],
            unique: [true, "Tên nhãn đã tồn tại!"]
        },
        markColor: {
            type: String,
            required: [true, 'Màu nhãn không tồn tại!'],
            unique: [true, "Màu nhãn đã tồn tại!"]
        }
    }
);
module.exports = mongoose.model("mark", markSchema);
