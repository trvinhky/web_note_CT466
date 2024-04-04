const asyncHandler = require("express-async-handler")
const workModel = require('../models/work.model')

const workControllers = {
    // tạo công việc
    create: asyncHandler(async (req, res) => {
        const { workTitle, workDateStart, workDateEnd, workDescription, userId, workStatus } = req.body

        // kiểm tra các trường
        if (!workTitle || !workDateStart || !workDateEnd || !workDescription || !userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        let status = JSON.parse(workStatus)
        if (typeof status !== 'boolean') status = false

        try {
            // thêm công việc mới
            const work = await workModel.create({
                workDateEnd,
                workDateStart,
                workTitle,
                workDescription,
                userId,
                workStatus: status
            })

            // kiểm tra công việc vừa thêm
            if (work) {
                return res.status(200).json({
                    message: "Thêm công việc mới thành công!",
                    errorCode: 0,
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
        const { workTitle, workDateStart, workDateEnd, workDescription, workStatus } = req.body

        // kiểm tra các trường
        if (!workTitle || !workDateStart || !workDateEnd || !workDescription || !id || typeof JSON.parse(workStatus) !== 'boolean') {
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
                        workStatus: JSON.parse(workStatus)
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
    // chỉnh sửa trạng thái công việc
    editStatus: asyncHandler(async (req, res) => {
        const { id } = req.query
        const { workStatus } = req.body

        // kiểm tra các trường
        if (!(typeof JSON.parse(workStatus) === "boolean") || !id) {
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
                        workStatus: JSON.parse(workStatus),
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
        const { id } = req.params

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
    // lấy thông tin công việc
    getOne: asyncHandler(async (req, res) => {
        const { userId, workDateEnd } = req.query

        // kiểm tra các trường
        if (!userId || !workDateEnd) {
            return res.status(400).json({
                errorCode: 1,
                message: 'Tất cả các trường là bắt buộc!'
            })
        }

        try {
            // lấy thông tin công việc theo id
            const work = await workModel.findOne({ userId, workDateEnd }).populate({
                path: 'userId',
                select: '-userPassword' // Loại bỏ trường userPassword từ bảng user
            })

            if (work) {
                return res.status(201).json({
                    errorCode: 0,
                    data: work,
                    message: "Lấy thông tin công việc thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Lấy thông tin công việc thất bại!"
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
    // lấy tất cả công việc
    getAll: asyncHandler(async (req, res) => {
        const { userId, status, year, month } = req.query

        // kiểm tra userId
        if (!userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'userId là bắt buộc!'
            })
        }

        try {
            // Điều kiện
            let condition = [];
            let conditionDate;
            const workStatus = status ? JSON.parse(status) : ''

            if (!isNaN(parseInt(year))) {
                let startDate;
                let endDate;
                if (!isNaN(parseInt(month))) {
                    startDate = new Date(year, month - 1, 1);
                    // Lấy ngày cuối cùng của tháng
                    endDate = new Date(year, month, 0, 23, 59, 59);
                } else {
                    startDate = new Date(year, 0, 1);
                    endDate = new Date(year, 11, 31, 23, 59, 59);
                }

                conditionDate = [
                    { workDateEnd: { $gte: startDate, $lt: endDate } }
                ]
            }

            if (typeof workStatus === 'boolean') {
                if (conditionDate) {
                    condition = {
                        $and: [
                            ...conditionDate,
                            { workStatus },
                            { userId }
                        ]
                    };
                } else {
                    condition = {
                        $and: [
                            { workStatus },
                            { userId }
                        ]
                    };
                }
            }

            if (conditionDate?.length > 0) {
                condition = {
                    $and: [
                        ...conditionDate,
                        { userId }
                    ]
                }
            }

            if (condition?.length < 1) {
                condition = { userId };
            }


            // lấy thông tin công việc theo id
            const works = await workModel.find(condition).populate({
                path: 'userId',
                select: '-userPassword' // Loại bỏ trường userPassword từ bảng user
            })

            if (works) {
                return res.status(201).json({
                    errorCode: 0,
                    data: works,
                    message: "Lấy thông tin công việc thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Lấy thông tin công việc thất bại!"
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
    // lấy tất cả công việc hiện tại
    getAllCurrent: asyncHandler(async (req, res) => {
        const { userId, status } = req.query

        // kiểm tra userId
        if (!userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'userId là bắt buộc!'
            })
        }

        try {
            // Điều kiện
            let condition = [];

            // Tạo giá trị cho ngày bắt đầu và kết thúc của ngày hiện tại
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            // Điều kiện
            let conditionDate = [
                { workDateEnd: { $gte: startDate, $lt: endDate } }
            ];

            if (status && typeof JSON.parse(status) === 'boolean') {
                if (conditionDate) {
                    condition = {
                        $and: [
                            ...conditionDate,
                            { workStatus: JSON.parse(status) },
                            { userId }
                        ]
                    };
                } else {
                    condition = {
                        $and: [
                            { workStatus: JSON.parse(status) },
                            { userId }
                        ]
                    };
                }
            }

            if (condition?.length < 1) {
                condition = { userId };
            }

            // lấy thông tin công việc theo id
            const works = await workModel.find(condition).populate({
                path: 'userId',
                select: '-userPassword' // Loại bỏ trường userPassword từ bảng user
            })

            if (works) {
                return res.status(201).json({
                    errorCode: 0,
                    data: works,
                    message: "Lấy thông tin công việc thành công!"
                })
            } else {
                return res.status(404).json({
                    errorCode: 2,
                    message: "Lấy thông tin công việc thất bại!"
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