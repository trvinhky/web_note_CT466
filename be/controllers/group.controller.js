const groupModel = require("../models/group.model")
const asyncHandler = require("express-async-handler")

const groupControllers = {
    // tạo group
    create: asyncHandler(async (req, res) => {
        const { groupName } = req.body

        // kiểm tra tên group
        if (!groupName) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tên group là trường bắt buộc!'
            })
        }

        try {
            // thêm mới group
            const group = await groupModel.create({
                groupName,
                groupCreateAt: new Date()
            })

            // kiểm tra group vừa thêm
            if (group) {
                return res.status(201).json({
                    message: "Thêm nhóm mới thành công!",
                    errorCode: 0,
                    data: group
                })
            } else {
                return res.status(404).json({
                    message: "Thêm nhóm mới thất bại!",
                    errorCode: 2
                })
            }
        } catch (e) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            })
        }
    }),
    // xóa group
    delete: asyncHandler(async (req, res) => {
        const { id } = req.query

        // kiểm tra id group
        if (!id) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Id group là trường bắt buộc!'
            })
        }

        try {
            // tìm kiếm và xóa group
            const isDelete = await groupModel.findOneAndDelete({
                _id: id
            })

            // kiểm tra group vừa xóa
            if (isDelete) {
                return res.status(200).json({
                    message: "Xóa nhóm thành công!",
                    errorCode: 0,
                })
            } else {
                return res.status(404).json({
                    message: "Xóa nhóm thất bại!",
                    errorCode: 2
                })
            }
        } catch (e) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            })
        }
    }),
    // cập nhật group
    edit: asyncHandler(async (req, res) => {
        const { id } = req.query
        const { groupName } = req.body

        // kiểm tra các trường
        if (!id || !groupName) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và cập nhật group
            const group = await groupModel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        groupCreateAt: new Date(),
                        groupName
                    }
                },
                { new: true }
            )

            // kiểm tra group vừa cập nhật
            if (group) {
                return res.status(201).json({
                    message: "Cập nhật nhóm thành công!",
                    errorCode: 0,
                    data: group
                })
            } else {
                return res.status(404).json({
                    message: "Cập nhật nhóm thất bại!",
                    errorCode: 2
                })
            }
        } catch (e) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            })
        }
    }),
}

module.exports = groupControllers