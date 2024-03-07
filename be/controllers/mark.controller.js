const asyncHandler = require("express-async-handler")
const markModel = require('../models/mark.model')

const markControllers = {
    // tạo nhãn
    create: asyncHandler(async (req, res) => {
        const { markName, markColor } = req.body

        // kiểm tra các trường
        if (!markName || !markColor) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // thêm nhãn mới
            const mark = await markModel.create({
                markName, markColor
            })

            // kiểm tra nhãn vừa thêm
            if (mark) {
                return res.status(200).json({
                    message: "Thêm mới nhãn thành công!",
                    errorCode: 0
                })
            } else {
                return res.status(404).json({
                    message: "Thêm mới nhãn thất bại!",
                    errorCode: 2
                })
            }
        } catch (e) {
            return res.status(500).json({
                message: "Lỗi server!",
                errorCode: 3,
                error: e.message
            })
        }
    }),
    // lấy tất cả nhãn
    getAll: asyncHandler(async (req, res) => {
        try {
            // lấy tất cả nhãn
            const marks = await markModel.find()

            // kiểm tra tất cả nhãn vừa lấy
            if (marks) {
                return res.status(200).json({
                    message: "Lấy tất cả nhãn thành công!",
                    errorCode: 0,
                    data: marks
                })
            } else {
                return res.status(404).json({
                    message: "Lấy tất cả nhãn thất bại!",
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
    // xóa nhãn
    delete: asyncHandler(async (req, res) => {
        const { id } = req.params

        // kiểm tra id nhãn
        if (!id) {
            return res.status(400).json({
                errorCode: 1,
                message: 'id nhãn là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và xóa nhãn dựa theo _id
            const isDelete = await markModel.findOneAndDelete({ _id: id })

            // kiểm tra nhãn đã xóa
            if (isDelete) {
                return res.status(200).json({
                    message: "Xóa nhãn thành công!",
                    errorCode: 0
                })
            } else {
                return res.status(404).json({
                    message: "Xóa nhãn thất bại!",
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

module.exports = markControllers