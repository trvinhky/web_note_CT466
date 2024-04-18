const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, 'Tên người dùng không tồn tại!'],
        },
        userEmail: {
            type: String,
            required: [true, 'Email không tồn tại!'],
            unique: [true, "Email đã tồn tại!"]
        },
        userPassword: {
            type: String,
            required: [true, 'Mật khẩu không tồn tại!'],
        }
    }
);
module.exports = mongoose.model("user", userSchema);
