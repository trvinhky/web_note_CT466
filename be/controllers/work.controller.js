const asyncHandler = require("express-async-handler")
const workModel = require('../models/work.model')

const workControllers = {
    // tạo công việc
    create: asyncHandler(async (req, res) => {
        const { workTitle, workDateStart, workDateEnd, workDescription, groupId } = req.body

        // kiểm tra các trường
        if (!workTitle || !workDateStart || !workDateEnd || !workDescription || !groupId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }
        try {
            // thêm công việc mới
            const work = await workModel.create({
                workDateEnd,
                workDateStart,
                workTitle,
                workDescription,
                groupId
            })

            // kiểm tra công việc vừa thêm
            if (work) {
                return res.status(201).json({
                    message: "Thêm công việc mới thành công!",
                    errorCode: 0,
                    data: work
                })
            } else {
                return res.status(404).json({
                    message: "Thêm công việc mới thất bại!",
                    errorCode: 2
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
    // chỉnh sửa công việc
    edit: asyncHandler(async (req, res) => {
        const { id } = req.query
        const { workTitle, workDateStart, workDateEnd, workDescription } = req.body

        // kiểm tra các trường
        if (!workTitle || !workDateStart || !workDateEnd || !workDescription || !id) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và cập nhật thông tin công việc
            const work = await workModel.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        workDateEnd,
                        workDateStart,
                        workTitle,
                        workDescription,
                    }
                },
                { new: true }
            )

            // kiểm tra cập nhật
            if (work) {
                return res.status(201).json({
                    message: "Cập nhật thông tin công việc thành công!",
                    data: work,
                    errorCode: 0
                })
            } else {
                return res.status(404).json({
                    message: "Cập nhật thông tin công việc thất bại!",
                    errorCode: 2
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
    // xóa công việc
    delete: asyncHandler(async (req, res) => {
        const { id } = req.query

        // kiểm tra id công việc
        if (!id) {
            return res.status(400).json({
                errorCode: 1,
                message: 'id công việc là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và xóa công việc theo id
            const isDelete = await workModel.findOneAndDelete({ _id: id })

            // kiểm tra công việc đã xóa 
            if (isDelete) {
                return res.status(200).json({
                    message: "Xóa công việc thành công!",
                    errorCode: 0
                })
            } else {
                return res.status(404).json({
                    message: "Xóa công việc thất bại!",
                    errorCode: 2
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
}

module.exports = workControllers