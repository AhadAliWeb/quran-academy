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
import EditStudent from "../AdminDashboard/EditStudent";
import AddTeacher from "../AdminDashboard/AddTeacher";
import EditTeacher from "../AdminDashboard/EditTeacher";
import { ProtectedRoute } from "../components/ProtectedRoute"
import TodayEnrollments from "../AdminDashboard/TodayEnrollments";
import EnrollmentDetailsEdit from "../AdminDashboard/EnrollmentDetailsEdit";


export const StudentDashboardRoutes = [
    {
        path: "/dashboard",
        element: <ProtectedRoute allowedRoles={["student"]}><DashboardLayout name="Student"></DashboardLayout></ProtectedRoute>,
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
        element: <ProtectedRoute allowedRoles={['teacher']}><DashboardLayout name="Teacher"></DashboardLayout></ProtectedRoute>,
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
                path: "general-evaluation/:enrollmentId",
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
        element: <ProtectedRoute allowedRoles={["admin"]}><DashboardLayout name="Admin"></DashboardLayout></ProtectedRoute>,
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
                path: "add-teacher",
                element: <AddTeacher />
            },
            {
                path: "edit-teacher/:teacherId",
                element: <EditTeacher />
            },
            {
                path: "add-new-student",
                element: <AddNewStudent />
            },
            {
                path: "edit-student/:studentId",
                element: <EditStudent />
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
            },
            {
                path: "enrollments",
                element: <TodayEnrollments />
            },
            {
                path: "enrollments/:enrollmentId",
                element: <EnrollmentDetailsEdit  />
            }
        ]
    }
]