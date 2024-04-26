const groupInfoModel = require("../models/groupInfo.model")
const asyncHandler = require("express-async-handler")

const groupInfoControllers = {
    // khởi tạo group
    create: asyncHandler(async (req, res) => {
        const { groupId, userId } = req.body

        //  kiểm tra các trường
        if (!groupId || !userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // thêm mới group info
            const groupInfo = await groupInfoModel.create({
                groupId,
                userId,
                groupInfoAdmin: true,
                groupInfoStatus: true
            })

            // kiểm tra group info vừa thêm
            if (groupInfo) {
                return res.status(201).json({
                    message: "Khởi tạo nhóm thành công!",
                    errorCode: 0,
                    data: groupInfo
                })
            } else {
                return res.status(404).json({
                    message: "Khởi tạo nhóm thất bại!",
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
    // thêm thành viên
    addMember: asyncHandler(async (req, res) => {
        const { userId, groupId } = req.body

        // kiểm tra các trường
        if (!groupId || !userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // kiểm tra tồn tại
            const check = await groupInfoModel.findOne({ groupId, userId })

            if (check) {
                return res.status(404).json({
                    message: "Thêm thành viên thất bại!",
                    errorCode: 2
                })
            }

            // tìm kiếm và cập nhật group info
            const groupInfo = await groupInfoModel.create({
                groupId,
                userId,
            })

            // kiểm tra group info vừa cập nhật
            if (groupInfo) {
                return res.status(201).json({
                    message: "Thêm thành viên thành công!",
                    errorCode: 0,
                    data: groupInfo
                })
            } else {
                return res.status(404).json({
                    message: "Thêm thành viên thất bại!",
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
    // Cập nhật trạng thái thành viên
    edit: asyncHandler(async (req, res) => {
        const { groupId, userId } = req.query

        // kiểm tra các trường
        if (!groupId || !userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và cập nhật trạng thái thành viên
            const groupInfo = await groupInfoModel.findOneAndUpdate(
                { groupId, userId },
                {
                    $set: {
                        groupInfoStatus: true
                    }
                },
                { new: true }
            )

            // kiểm tra trạng thái thành viên vừa cập nhật
            if (groupInfo) {
                return res.status(201).json({
                    message: "Cập nhật trạng thái thành viên thành công!",
                    errorCode: 0,
                    data: groupInfo
                })
            } else {
                return res.status(404).json({
                    message: "Cập nhật trạng thái thành viên thất bại!",
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
    // xóa thành viên khỏi nhóm
    delete: asyncHandler(async (req, res) => {
        const { groupId, userId } = req.query

        // kiểm tra các trường
        if (!groupId || !userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và xóa thành viên
            const isDelete = await groupInfoModel.findOneAndDelete({
                groupId, userId
            })

            // kiểm tra thành viên vừa xóa
            if (isDelete) {
                return res.status(200).json({
                    message: "Xóa thành viên thành công!",
                    errorCode: 0,
                })
            } else {
                return res.status(404).json({
                    message: "Xóa thành viên thất bại!",
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
    // Lấy thông tin group
    getOne: asyncHandler(async (req, res) => {
        const { groupId } = req.query

        // kiểm tra id group
        if (!groupId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Id group là bắt buộc!'
            })
        }

        try {
            // tìm kiếm thông tin group
            const groupInfo = await groupInfoModel
                .find({ groupId })
                .populate([
                    { path: 'groupId' },
                    { path: 'userId', select: '-userPassword' }
                ])

            // kiểm tra thông tin group vừa lấy
            if (groupInfo) {
                const members = []
                let group
                groupInfo.forEach((el) => {
                    if (members.length === 0) {
                        group = el.groupId
                    }
                    members.push({
                        user: el.userId,
                        admin: el.groupInfoAdmin,
                        status: el.groupInfoStatus
                    })
                })

                return res.status(201).json({
                    message: "Lấy thông tin group thành công!",
                    errorCode: 0,
                    data: {
                        group,
                        members
                    }
                })
            } else {
                return res.status(404).json({
                    message: "Lấy thông tin group thất bại!",
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
    // Lấy tất cả group theo userId
    getByUser: asyncHandler(async (req, res) => {
        const { userId, status } = req.query

        // kiểm tra userId
        if (!userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'userId là bắt buộc!'
            })
        }

        const groupInfoStatus = status ? JSON.parse(status) : false

        try {
            // tìm kiếm tất cả group
            const groups = await groupInfoModel.find({ userId, groupInfoStatus }).populate({
                path: 'groupId',
            })

            // kiểm tra tất cả group vừa lấy
            if (groups) {
                return res.status(201).json({
                    message: "Lấy tất cả group thành công!",
                    errorCode: 0,
                    data: groups
                })
            } else {
                return res.status(404).json({
                    message: "Lấy tất cả group thất bại!",
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

module.exports = groupInfoControllers