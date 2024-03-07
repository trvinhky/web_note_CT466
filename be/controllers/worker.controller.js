const asyncHandler = require("express-async-handler")
const workerModel = require('../models/worker.model')

const workerControllers = {
    // thêm người dùng vào công việc
    create: asyncHandler(async (req, res) => {
        const { userId, workId, workerNote } = req.body

        // kiểm tra các trường
        if (!userId || !workId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // Tạo dữ liệu thêm vào
            let data = {
                userId,
                workId,
                workerCreateAt: new Date()
            }
            if (workerNote) data = { ...data, workerNote }

            // thêm người dùng vào công việc
            const worker = await workerModel.create(data)

            // kiểm tra người dùng vừa thêm
            if (worker) {
                return res.status(200).json({
                    message: "Thêm người dùng vào công việc thành công!",
                    errorCode: 0
                })
            } else {
                return res.status(404).json({
                    message: "Thêm người dùng vào công việc thất bại!",
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
    // cập nhật trạng thái người dùng
    edit: asyncHandler(async (req, res) => {
        const { id, userId } = req.query
        const { workerStatus } = req.body

        const checkValue = (val) => !isNaN(parseInt(val)) && [0, 1, 2].indexOf(+val) !== -1

        // kiểm tra các trường
        if (!id || !userId || !checkValue(workerStatus)) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và cập nhật trạng thái người dùng
            const worker = await workerModel.findOneAndUpdate(
                { _id: id, userId },
                {
                    $set: {
                        workerStatus
                    }
                },
                { new: true }
            )

            // kiểm tra cập nhật
            if (worker) {
                return res.status(201).json({
                    message: "Cập nhật trạng thái người dùng thành công!",
                    data: worker,
                    errorCode: 0
                })
            } else {
                return res.status(404).json({
                    message: "Cập nhật trạng thái người dùng thất bại!",
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
    // xóa người dùng khỏi công việc
    delete: asyncHandler(async (req, res) => {
        const { userId, workId } = req.query

        // kiểm tra các trường
        if (!userId || !workId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và xóa người dùng khỏi công việc
            const isDelete = await workerModel.findOneAndDelete({ _id: id, userId })

            // kiểm tra người dùng đã xóa 
            if (isDelete) {
                return res.status(200).json({
                    message: "Xóa người dùng khỏi công việc thành công!",
                    errorCode: 0
                })
            } else {
                return res.status(404).json({
                    message: "Xóa người dùng khỏi công việc thất bại!",
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
    // xóa tất cả người dùng khỏi công việc
    deleteByWorkId: asyncHandler(async (req, res) => {
        const { workId } = req.params

        // kiểm tra id công việc
        if (!workId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'id công việc là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và xóa tất cả người dùng khỏi công việc
            const isDelete = await workerModel.deleteMany({ workId })

            // kiểm tra tất cả người dùng đã xóa 
            if (isDelete) {
                return res.status(200).json({
                    message: "Xóa tất cả người dùng khỏi công việc thành công!",
                    errorCode: 0
                })
            } else {
                return res.status(404).json({
                    message: "Xóa tất cả người dùng khỏi công việc thất bại!",
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
    // lấy tất cả người dùng trong công việc
    getWorkerByWorkId: asyncHandler(async (req, res) => {
        const { workId } = req.params

        // kiểm tra id công việc
        if (!workId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'id công việc là bắt buộc!'
            })
        }

        try {
            // tìm kiếm và lấy tất cả người dùng theo id công việc
            const workers = await workerModel.find({ workId, workerStatus: 1 }).populate({
                path: 'userId',
                select: '-userPassword' // Loại bỏ trường userPassword từ bảng user
            })

            // kiểm tra tất cả người dùng đã lấy 
            if (workers) {
                return res.status(201).json({
                    message: "Lấy tất cả người dùng trong công việc thành công!",
                    errorCode: 0,
                    data: workers
                })
            } else {
                return res.status(404).json({
                    message: "Lấy tất cả người dùng trong công việc thất bại!",
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
    // lấy tất cả công việc theo id người dùng
    getAllByUserId: asyncHandler(async (req, res) => {
        const { year, month, markId, userId } = req.query

        // kiểm tra id người dùng
        if (!userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'id người dùng là bắt buộc!'
            })
        }

        try {
            // điều kiện
            let conditionDate
            let condition = { userId }

            if (!isNaN(parseInt(year))) {
                let startDate
                let endDate
                if (!isNaN(parseInt(month))) {
                    startDate = new Date(year, month - 1, 1);
                    // lấy ngày cuối cùng của tháng
                    endDate = new Date(year, month, 0, 23, 59, 59);
                } else {
                    startDate = new Date(year, 0, 1);
                    endDate = new Date(year, 11, 31, 23, 59, 59);
                }

                conditionDate = [
                    { workDateStart: { $gte: startDate, $lte: endDate } },
                    { workDateEnd: { $gte: startDate, $lte: endDate } }
                ]
            }

            // kiểm tra các trường
            if (markId) {
                if (conditionDate) {
                    condition = {
                        $and: [
                            {
                                $or: conditionDate
                            },
                            { markId, userId }
                        ]
                    }
                } else {
                    condition = { markId, userId }
                }
            } else {
                if (conditionDate) {
                    condition = {
                        $and: [
                            {
                                $or: conditionDate
                            },
                            { userId }
                        ]
                    }
                }
            }

            // lấy tất cả công việc theo điều kiện
            const works = await workerModel.find(condition).populate({
                path: "workId",
                populate: [
                    { path: "markId" },
                    { path: "userId", select: "-userPassword" }
                ]
            });

            // kiểm tra tất cả công việc đã lấy 
            if (works) {
                return res.status(201).json({
                    message: "Lấy tất cả công việc thành công!",
                    errorCode: 0,
                    data: works
                })
            } else {
                return res.status(404).json({
                    message: "Lấy tất cả công việc thất bại!",
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
    })
}

module.exports = workerControllers