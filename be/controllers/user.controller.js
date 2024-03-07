const asyncHandler = require("express-async-handler")
const bcrypt = require("bcrypt")
const userModel = require('../models/user.model')

const userControllers = {
    // tạo tài khoản người dùng
    create: asyncHandler(async (req, res) => {
        const { userName, userEmail, userAddress, userPhone, userPassword } = req.body;

        // kiểm tra các trường
        if (!userName || !userEmail || !userAddress || !userPhone || !userPassword) {
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
                userAddress,
                userPhone,
            });

            // kiểm tra người dùng vừa thêm
            if (user) {
                return res.status(200).json({
                    errorCode: 0,
                    message: "Đăng ký tài khoản thành công!"
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
                        id: user._id
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
    // lấy số lượng người dùng
    getCount: asyncHandler(async (req, res) => {
        try {
            // đếm số lượng người dùng
            const count = await userModel.countDocuments()

            // kiểm tra số lượng vừa lấy
            if (!isNaN(parseInt(count))) {
                return res.status(201).json({
                    data: count,
                    errorCode: 0,
                    message: 'Đếm số lượng người dùng thành công!'
                })
            } else {
                return res.status(404).json({
                    message: "Không thể đếm số lượng!",
                    errorCode: 2
                })
            }
        } catch (err) {
            return res.status(500).json({
                message: "Lỗi server!",
                error: err.message,
                errorCode: 3
            })
        }
    }),
    // lấy thông tin người dùng
    getOne: asyncHandler(async (req, res) => {
        const { id } = req.params

        // kiểm tra id người dùng
        if (!id) {
            return res.status(400).json({
                errorCode: 1,
                message: "Không tồn tại id người dùng!"
            })
        }

        try {
            // lấy thông tin người dùng theo id
            const user = await userModel.findOne({ _id: id }).select('-userPassword')

            if (user) {
                return res.status(201).json({
                    errorCode: 0,
                    data: user,
                    message: "Lấy thông tin người dùng thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Lấy thông tin người dùng thất bại!"
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
    edit: asyncHandler(async (req, res) => {
        const { id } = req.params
        const { userName, userAddress, userPhone } = req.body;

        // kiểm tra các trường
        if (!id || !userName || !userAddress || !userPhone) {
            return res.status(400).json({
                errorCode: 1,
                message: "Tất cả các trường là bắt buộc!"
            })
        }

        try {
            // tìm kiếm và cập nhật người dùng theo _id
            const user = await userModel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        userName,
                        userAddress,
                        userPhone
                    }
                },
                { new: true }
            )

            // kiểm tra người dùng vừa cập nhật
            if (user) {
                return res.status(201).json({
                    errorCode: 0,
                    data: {
                        id: user._id,
                        userName: user.userName,
                        userEmail: user.userEmail,
                        userAddress: user.userAddress,
                        userPhone: user.userPhone,
                        userRole: user.userRole,
                    },
                    message: "Cập nhật thông tin người dùng thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Cập nhật thông tin người dùng thất bại!"
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
    search: asyncHandler(async (req, res) => {
        const { userEmail } = req.params

        // kiểm tra email
        if (!userEmail) {
            return res.status(400).json({
                errorCode: 1,
                message: "Trường Email là bắt buộc!"
            })
        }

        try {
            // tìm kiếm người dùng theo email
            const users = await userModel.find(
                { userEmail: { $regex: userEmail, $options: 'i' } },
            ).select('-userPassword')

            // kiểm tra người dùng vừa tìm
            if (users) {
                return res.status(201).json({
                    errorCode: 0,
                    data: users,
                    message: "Tìm kiếm người dùng theo email thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Tìm kiếm người dùng theo email thất bại!"
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