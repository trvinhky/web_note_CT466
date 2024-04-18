const workInfoModel = require("../models/workInfo.model")
const asyncHandler = require("express-async-handler")

const workInfoControllers = {
    // thêm thông tin công việc
    create: asyncHandler(async (req, res) => {
        const { groupId, userId, workId } = req.body

        //  kiểm tra các trường
        if (!groupId || !userId || !workId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // thêm mới thông tin công việc
            const workInfo = await workInfoModel.create({
                groupId,
                userId,
                workId
            })

            // kiểm tra thông tin công việc vừa thêm
            if (workInfo) {
                return res.status(201).json({
                    message: "Thông tin công việc thành công!",
                    errorCode: 0,
                    data: groupInfo
                })
            } else {
                return res.status(404).json({
                    message: "Thông tin công việc thất bại!",
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
    // cập nhật trạng thái công việc
    edit: asyncHandler(async (req, res) => {
        const { groupId, userId, workId } = req.query
        const { workInfoStatus } = req.body

        // kiểm tra các trường
        if (!groupId || !userId || !workId || typeof JSON.parse(workInfoStatus) !== 'boolean') {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và cập nhật trạng thái công việc
            const workInfo = await workInfoModel.findOneAndUpdate(
                { groupId, userId, workId },
                {
                    $set: {
                        workInfoStatus: JSON.parse(workInfoStatus)
                    }
                },
                { new: true }
            )

            // kiểm tra trạng thái công việc vừa cập nhật
            if (workInfo) {
                return res.status(201).json({
                    message: "Cập nhật trạng thái công việc thành công!",
                    errorCode: 0,
                    data: workInfo
                })
            } else {
                return res.status(404).json({
                    message: "Cập nhật trạng thái công việc thất bại!",
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
    // xóa thông tin công việc
    delete: asyncHandler(async (req, res) => {
        const { groupId, workId } = req.query

        // kiểm tra các trường
        if (!groupId || !workId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và xóa thông tin công việc
            const isDeleteAll = await workInfoModel.deleteMany(
                { groupId, workId }
            )

            // kiểm tra thông tin công việc vừa xóa
            if (isDeleteAll) {
                return res.status(200).json({
                    message: "Xóa thông tin công việc thành công!",
                    errorCode: 0,
                })
            } else {
                return res.status(404).json({
                    message: "Xóa thông tin công việc thất bại!",
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
    // lấy chi tiết công việc
    getOne: asyncHandler(async (req, res) => {
        const { groupId, userId, workId } = req.query

        // kiểm tra các trường
        if (!groupId || !userId || !workId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm chi tiết công việc
            const workInfo = await workInfoModel.findOne(
                { groupId, userId, workId }
            ).populate([
                { path: 'groupId' },
                { path: 'workId' },
                { path: 'userId', select: '-userPassword' }
            ])

            // kiểm tra chi tiết công việc vừa tìm
            if (workInfo) {
                return res.status(201).json({
                    message: "Lấy chi tiết công việc thành công!",
                    errorCode: 0,
                    data: workInfo
                })
            } else {
                return res.status(404).json({
                    message: "Lấy chi tiết công việc thất bại!",
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
    // lấy tất cả công việc 
    getAll: asyncHandler(async (req, res) => {
        const { groupId, userId, status } = req.query

        // kiểm tra các trường
        if (!groupId || !userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            const groupInfoStatus = status ? JSON.parse(status) : null
            let condition = { groupId, userId };

            if (groupInfoStatus !== null) {
                condition = { ...condition, groupInfoStatus }
            }
            // tìm kiếm tất cả công việc 
            const workInfo = await workInfoModel.find(
                condition
            ).populate([
                { path: 'groupId' },
                { path: 'workId' },
            ])

            // kiểm tra tất cả công việc vừa tìm
            if (workInfo) {
                return res.status(201).json({
                    message: "Lấy tất cả công việc thành công!",
                    errorCode: 0,
                    data: workInfo
                })
            } else {
                return res.status(404).json({
                    message: "Lấy tất cả công việc thất bại!",
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

module.exports = workInfoControllers