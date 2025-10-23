import { Home, Users, GraduationCap, BookPlus, UserPlus, FilePlus, UserRoundPlus, CheckCircle, BookOpen, ClipboardList } from 'lucide-react';


const ADMIN_BASE_PATH = "/admin/dashboard"
const TEACHER_BASE_PATH = "/teacher/dashboard"
const STUDENT_BASE_PATH = "/dashboard"


const studentLinks = [
    {
        id: 'Home',
        text: "Home",
        icon: Home,
        to: `${STUDENT_BASE_PATH}/`
    },
    {
        id: 'Enrolled Courses',
        text: "Enrolled Courses",
        icon: BookOpen,
        to: `${STUDENT_BASE_PATH}/enrolled-courses`
    },
    {
        id: "Attendance",
        text: "Attendance",
        icon: ClipboardList,
        to: `${STUDENT_BASE_PATH}/attendance-summary`
    },
]


const teacherLinks = [
    {
        id: 'home',
        text: "Home",
        icon: Home,
        to: `${TEACHER_BASE_PATH}/`
    },
    {
        id: 'Class Students',
        text: "Class Students",
        icon: Users,
        to: `${TEACHER_BASE_PATH}/class-students`,
    },
    {
        id: "Today's Classes",
        text: "Today's Classes",
        icon: CheckCircle,
        to: `${TEACHER_BASE_PATH}/today-classes`
    }
]

const adminLinks = [
    {
    id: 'home',
    text: 'Home',
    icon: Home,
    to: `${ADMIN_BASE_PATH}/`
    },
    {
    id: 'students',
    text: 'All Students',
    icon: GraduationCap,
    to: `${ADMIN_BASE_PATH}/all-students`
    },
    {
    id: 'teachers',
    text: 'All Teachers',
    icon: Users,
    to: `${ADMIN_BASE_PATH}/all-teachers`
    },
    {
        id: "course-management",
        text: "Course Management",
        icon: BookPlus,
        to: `${ADMIN_BASE_PATH}/course-management`,
    },
    {
        id: 'add-new-student',
        text: "Add New Student",
        icon: UserPlus,
        to: `${ADMIN_BASE_PATH}/add-new-student`
    },
    {
        id: 'add-student-to-course',
        text: "Add Student to Course",
        icon: UserRoundPlus,
        to: `${ADMIN_BASE_PATH}/add-student-course`
    },
    {
        id: 'unapproved-users',
        text: "UnApproved Users",
        icon: CheckCircle,
        to: `${ADMIN_BASE_PATH}/unapproved-users`
    },
    {
        id: 'enrollments',
        text: "Enrollments",
        icon: ClipboardList,
        to: `${ADMIN_BASE_PATH}/enrollments`
    }
];


export {teacherLinks, adminLinks, studentLinks}