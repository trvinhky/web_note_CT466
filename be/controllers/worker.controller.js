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
        const { year, month, userId } = req.query;

        // Kiểm tra id người dùng
        if (!userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'id người dùng là bắt buộc!'
            });
        }

        try {
            // Điều kiện
            let condition;

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

                condition = {
                    $and: [
                        { workDateStart: { $gte: startDate } },
                        { workDateEnd: { $lte: endDate } }
                    ]
                };
            }

            // Tìm các công việc của người dùng trong khoảng thời gian đã cho
            const works = await workerModel.find({ userId })
                .populate({
                    path: "workId",
                    match: condition,
                    populate: [
                        { path: "markId" },
                        { path: "userId", select: "-userPassword" }
                    ]
                });

            // Kiểm tra tất cả công việc đã lấy 
            if (works.length > 0) {
                return res.status(200).json({
                    message: "Lấy tất cả công việc của người dùng thành công!",
                    errorCode: 0,
                    data: works
                });
            } else {
                return res.status(404).json({
                    message: "Không có công việc nào được tìm thấy cho người dùng!",
                    errorCode: 2
                });
            }
        } catch (err) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            });
        }
    }),
    // lấy tất cả công việc theo trạng thái của người dùng
    getAllWorkByStatus: asyncHandler(async (req, res) => {
        const { userId, status } = req.query;

        // Kiểm tra id người dùng
        if (!userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'id người dùng là bắt buộc!'
            });
        }

        // Kiểm tra trạng thái
        if (status && [0, 1, 2].indexOf(parseInt(status)) === -1) {
            return res.status(400).json({
                errorCode: 1,
                message: 'trạng thái không hợp lý!'
            });
        }

        try {
            // Tìm các công việc của người dùng theo trạng thái
            const works = await workerModel.find({ userId, workerStatus: status || 0 })
                .populate({
                    path: "workId",
                    populate: [
                        { path: "markId" },
                        { path: "userId", select: "-userPassword" }
                    ]
                });

            // Kiểm tra tất cả công việc đã lấy 
            if (works.length > 0) {
                return res.status(200).json({
                    message: "Lấy tất cả công việc của người dùng thành công!",
                    errorCode: 0,
                    data: works
                });
            } else {
                return res.status(404).json({
                    message: "Không có công việc nào được tìm thấy cho người dùng!",
                    errorCode: 2
                });
            }
        } catch (err) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            });
        }
    }),
    // lấy tất cả công việc theo ngày hiện tại
    getAllWorkCurrent: asyncHandler(async (req, res) => {
        const { userId } = req.params;

        // Kiểm tra id người dùng
        if (!userId) {
            return res.status(400).json({
                errorCode: 1,
                message: 'id người dùng là bắt buộc!'
            });
        }

        try {
            // Tạo giá trị cho ngày bắt đầu và kết thúc của ngày hiện tại
            const today = new Date();
            const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

            // Điều kiện
            let condition = {
                workDateStart: { $gte: startDate, $lt: endDate }
            };

            // Lấy tất cả công việc theo điều kiện
            const works = await workerModel.find({ userId })
                .populate({
                    path: "workId",
                    match: condition,
                    populate: [
                        { path: "markId" },
                        { path: "userId", select: "-userPassword" }
                    ]
                });

            // Kiểm tra tất cả công việc đã lấy 
            if (works.length > 0) {
                return res.status(200).json({
                    message: "Lấy tất cả công việc của người dùng trong ngày hôm nay thành công!",
                    errorCode: 0,
                    data: works
                });
            } else {
                return res.status(404).json({
                    message: "Không có công việc nào được tìm thấy cho người dùng trong ngày hôm nay!",
                    errorCode: 2
                });
            }
        } catch (err) {
            return res.status(500).json({
                errorCode: 3,
                message: "Lỗi server!",
                error: err.message
            });
        }
    })
}

module.exports = workerControllers