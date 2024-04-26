const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const userModel = require('../models/user.model')

const userControllers = {
    // tạo tài khoản người dùng
    create: asyncHandler(async (req, res) => {
        const { userName, userEmail, userPassword } = req.body;

        // kiểm tra các trường
        if (!userName || !userEmail || !userPassword) {
            return res.status(400).json({
                errorCode: 1,
                message: "Tất cả các trường là bắt buộc!"
            });
        }

        // mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(userPassword, 10);

        try {
            // thêm mới người dùng
            const user = await userModel.create({
                userName,
                userEmail,
                userPassword: hashedPassword,
            });

            // kiểm tra người dùng vừa thêm
            if (user) {
                return res.status(200).json({
                    errorCode: 0,
                    message: "Đăng ký tài khoản thành công!",
                    data: {
                        _id: user._id,
                        userName: user.userName,
                        userEmail: user.userEmail
                    }
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Đăng ký tài khoản thất bại!"
                });
            }
        } catch (err) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            })
        }
    }),
    // đăng nhập tài khoản người dùng
    login: asyncHandler(async (req, res) => {
        const { userEmail, userPassword } = req.body


        // kiểm tra các trường
        if (!userEmail || !userPassword) {
            return res.status(400).json({
                errorCode: 1,
                message: "Tất cả các trường là bắt buộc!"
            });
        }

        try {
            // tìm kiếm người dùng trong database
            const user = await userModel.findOne({ userEmail })

            // kiểm tra người dùng vừa lấy và so khớp mật khẩu
            if (user && (await bcrypt.compare(userPassword, user.userPassword))) {
                return res.status(201).json({
                    errorCode: 0,
                    data: {
                        _id: user._id,
                        userName: user.userName,
                        userEmail: user.userEmail,
                    },
                    message: "Đăng nhập tài khoản thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Email hoặc mật khẩu không khớp!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            })
        }
    }),
    // tìm kiếm người dùng theo email
    search: asyncHandler(async (req, res) => {
        const { email } = req.query

        // kiểm tra email
        if (!email) {
            return res.status(400).json({
                errorCode: 1,
                message: "Email là trường bắt buộc!"
            });
        }

        try {
            // tìm kiếm người dùng trong database
            const users = await userModel.find({ userEmail: { $regex: email, $options: 'i' } }, '-userPassword')

            // kiểm tra người dùng vừa lấy 
            if (users) {
                return res.status(201).json({
                    errorCode: 0,
                    data: users,
                    message: "Tìm kiếm tài khoản thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Không tìm thấy tài khoản nào!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            })
        }
    }),
    // lấy thông tin người dùng theo id
    getInfo: asyncHandler(async (req, res) => {
        const { id } = req.query

        // kiểm tra id
        if (!id) {
            return res.status(400).json({
                errorCode: 1,
                message: "id là trường bắt buộc!"
            });
        }

        try {
            // tìm kiếm người dùng trong database
            const user = await userModel.findOne({ _id: id }, '-userPassword')

            // kiểm tra người dùng vừa lấy
            if (user) {
                return res.status(201).json({
                    errorCode: 0,
                    data: user,
                    message: "Lấy thông tin tài khoản thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Không tìm thấy tài khoản nào!"
                })
            }
        } catch (err) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            })
        }
    })
}

module.exports = userControllers