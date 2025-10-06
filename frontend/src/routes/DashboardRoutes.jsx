import AddNewStudent from "../AdminDashboard/AddNewStudent";
import AddStudentToCourse from "../AdminDashboard/AddStudentToCourse";
import AdminDashHome from "../AdminDashboard/AdminDashHome";
import AllStudents from "../AdminDashboard/AllStudents";
import AllTeachers from "../AdminDashboard/AllTeachers";
import CourseManagement from "../AdminDashboard/CourseManagement";
import UnapprovedUsers from "../AdminDashboard/UnApprovedUsers";
import DashboardLayout from "../components/DashboardLayout";
import AllLessons from "../StudentDashboard/AllLessons";
import AttendanceDetails from "../StudentDashboard/AttendanceDetails";
import AttendanceSummary from "../StudentDashboard/AttendanceSummary";
import EnrolledCourses from "../StudentDashboard/EnrolledCourses";
import LessonDetails from "../StudentDashboard/LessonDetails";
import StudentDashHome from "../StudentDashboard/StudentDashHome";
import TodayClasses from "../TeacherDashboard/TodayClasses";
import ClassStudents from "../TeacherDashboard/ClassStudents";
import DisplayLesson from "../TeacherDashboard/DisplayLesson";
import TeacherDashHome from "../TeacherDashboard/TeacherDashHome";
import MonthlyReport from "../TeacherDashboard/MonthlyReport";
import GeneralEvaluation from "../TeacherDashboard/GeneralEvaluation";
import MonthlyReports from "../StudentDashboard/MonthlyReports";


export const StudentDashboardRoutes = [
    {
        path: "/dashboard",
        element: <DashboardLayout name="Student"></DashboardLayout>,
        children: [
            {
                path: "",
                element: <StudentDashHome />
            },
            {
                path: "enrolled-courses",
                element: <EnrolledCourses />
            },
            {
                path: "monthly-reports/:enrollmentId",
                element: <MonthlyReports />,
            },
            {
                path: "all-lessons/:enrollmentId",
                element: <AllLessons />
            },
            {
                path: "lesson-details/:lessonId",
                element: <LessonDetails />
            },
            {
                path: "attendance-summary",
                element: <AttendanceSummary />
            },
            {
                path: "attendance-details/:enrollmentId",
                element: <AttendanceDetails />
            }
        ]
    }
]

export const TeacherDashboardRoutes = [
    {
        path: "/teacher/dashboard",
        element: <DashboardLayout name="Teacher"></DashboardLayout>,
        children: [
            {
                path: "",
                element: <TeacherDashHome />
            },
            {
                path: "class-students",
                element: <ClassStudents />
            },
            {
                path: "today-classes",
                element: <TodayClasses />
            },
            {
                path: "general-evaluation",
                element: <GeneralEvaluation />
            },
            {
                path: "display-lesson/:enrollmentId",
                element: <DisplayLesson />
            },
            {
                path: "monthly-report/:enrollmentId",
                element: <MonthlyReport />
            }
        ]
    }
]

export const AdminDashboardRoutes = [
    {
        path: "/admin/dashboard",
        element: <DashboardLayout name="Admin"></DashboardLayout>,
        children: [
            {
                index: true,
                element: <AdminDashHome />
            },
            {
                path: "all-students",
                element: <AllStudents />
            },
            {
                path: "all-teachers",
                element: <AllTeachers />
            },
            {
                path: "add-new-student",
                element: <AddNewStudent />
            },
            {
                path: "course-management",
                element: <CourseManagement />
            },
            {
                path: "add-student-course",
                element: <AddStudentToCourse />
            },
            {
                path: "unapproved-users",
                element: <UnapprovedUsers />
            }
        ]
    }
]