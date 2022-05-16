export interface Attendance {
    id: number,
    image: string,
    position: string,
    date: Date,
    time: Date,
    type: string,
    status: string
}

export interface AttendanceData {
    position: string,
    date: Date,
    time: Date,
    type: string,
    status: string
}

export interface SearchAttendance {
    date: Date,
}

export interface UpdateAttendanceData{ 
    type: string,
    status: string
}