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
        userAddress: {
            type: String,
            required: [true, 'Địa chỉ không tồn tại!'],
        },
        userPhone: {
            type: String,
            required: [true, 'Số điện thoại không tồn tại!'],
            unique: [true, "Số điện thoại đã tồn tại!"]
        },
        userPassword: {
            type: String,
            required: [true, 'Mật khẩu không tồn tại!'],
        },
        userRole: {
            type: String,
            default: 'user',
            values: ['user', 'admin']
        },
        Token: {
            type: String
        }
    }
);
module.exports = mongoose.model("user", userSchema);
