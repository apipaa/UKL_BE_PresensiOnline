const attendanceModel = require(`../models/index`).presensi;
const { Op } = require(`sequelize`);
const moment = require(`moment`);

// presensi.controller.js

// presensi.controller.js

exports.addAttendance = async (req, res) => {
    try {
        const { iduser, date, time, status } = req.body; // Getting data from request body

        const newAttendance = {
            iduser,
            date,
            time,
            status,
        };

        // Assuming `attendanceModel` is imported from your model
        const result = await attendanceModel.create(newAttendance);

        return res.json({
            status: 'success',
            message: 'Attendance successfully recorded',
            data: result, // Send back the created attendance data
        });
    } catch (error) {
        console.error('Error adding attendance:', error);
        return res.status(500).json({
            success: false,
            message: `Error recording attendance: ${error.message}`,
        });
    }
};



exports.getAttendanceById = async (req, res) => {
    try {
        const { iduser } = req.params;

        const attendanceData = await attendanceModel.findAll({
            where: { iduser: iduser } // Konsisten dengan model schema
        });

        if (attendanceData.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No attendance records found for user ID ${iduser}`
            });
        }
        0
        const formattedData = attendanceData.map(item => ({
            attendance_id: item.id,
            iduser: iduser,
            date: moment(item.date).format(`YYYY-MM-DD`),
            time: item.time, // Ambil waktu langsung dari item
            status: item.status
        }));

        return res.json({
            status: `success`,
            data: formattedData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Error retrieving attendance: ${error.message}`
        });
    }
};


exports.history = async (req, res) => {
    try {
        const { iduser } = req.params; // Get the `iduser` from request parameters

        // Fetch attendance data using `iduser`
        const attendanceData = await attendanceModel.findAll({
            where: { iduser } // Use `iduser` to filter records in the database
        });

        // If no records are found
        if (!attendanceData || attendanceData.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No attendance records found for user ID ${iduser}`
            });
        }

        // Format the fetched attendance data
        const formattedData = attendanceData.map(item => ({
            attendance_id: item.id,
            iduser: item.iduser, // Ensure this matches the user ID field in your database
            date: moment(item.date).format('YYYY-MM-DD'), // Format date properly
            time: item.time, // Get time from the database entry
            status: item.status // Status of the attendance
        }));

        // Return the formatted data as a response
        res.status(200).json({
            status: 'success',
            message: 'Attendance history fetched successfully',
            data: formattedData
        });
    } catch (error) {
        console.error('Error fetching history:', error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: `Error fetching history: ${error.message}`,
        });
    }
};

exports.getAttendanceForMonth = async (req, res) => {
    try {
        const { iduser, month, year } = req.params; // ID user, bulan, dan tahun dari parameter URL

        // Tentukan rentang tanggal untuk bulan tersebut
        const startDate = moment(`${year}-${month}-01`).startOf('month').format('YYYY-MM-DD');
        const endDate = moment(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD');

        // Ambil data presensi untuk user pada bulan dan tahun yang diberikan
        const attendanceData = await attendanceModel.findAll({
            where: {
                iduser,
                date: {
                    [Op.gte]: startDate, // Tanggal mulai
                    [Op.lte]: endDate,   // Tanggal akhir
                },
            },
        });

        // Jika tidak ada data ditemukan
        if (attendanceData.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No attendance records found for user ID ${iduser} in ${month}-${year}`,
            });
        }

        // Hitung jumlah kehadiran berdasarkan status
        let hadir = 0;
        let izin = 0;
        let sakit = 0;
        let alpa = 0;

        attendanceData.forEach(item => {
            if (item.status === 'hadir') hadir++;
            if (item.status === 'izin') izin++;
            if (item.status === 'sakit') sakit++;
            if (item.status === 'alpa') alpa++;
        });

        return res.status(200).json({
            status: 'success',
            data: {
                iduser: iduser,
                month: `${month}-${year}`,
                attendance_summary: {
                    hadir,
                    izin,
                    sakit,
                    alpa,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching attendance for the month:", error);
        return res.status(500).json({
            success: false,
            message: `Error fetching attendance for the month: ${error.message}`,
        });
    }
};