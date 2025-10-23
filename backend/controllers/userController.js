const asyncHandler = require( 'express-async-handler');
const User = require( '../models/userModel.js');
const generateToken = require( '../utils/generateToken.js');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError, NotFoundError } = require("../errors")

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.status(StatusCodes.OK).json({user: {name: user.name, email: user.email, role: user.role, isApproved: user.isApproved, id: user._id}})
  } else {
    throw new UnauthenticatedError("Invalid Email or Password")
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) throw new BadRequestError("User Already Exists")

  const user = await User.create({
    name,
    email,
    password,
    role
  });

  if (user) {
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    throw new BadRequestError("Invalid User Data")
  }
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const getAllUsers = asyncHandler(async (req, res) => {

  const users = await User.find();

  res.status(StatusCodes.OK).json({msg: "Users Found Successfully", users})

})

const addBulkStudents = asyncHandler(async(req, res) => {

  const students = [
    {
      "name": "Ahmed Ali",
      "email": "ahmed.ali@example.com",
      "password": "Ahm3d@2025"
    },
    {
      "name": "Ayesha Khan",
      "email": "ayesha.khan@example.com",
      "password": "Ayesh@1234"
    },
    {
      "name": "Bilal Hussain",
      "email": "bilal.hussain@example.com",
      "password": "B1l@l_567"
    },
    {
      "name": "Fatima Malik",
      "email": "fatima.malik@example.com",
      "password": "F@t1m@2025"
    },
    {
      "name": "Usman Ahmad",
      "email": "usman.ahmad@example.com",
      "password": "Usm@_a10"
    },
    {
      "name": "Sana Shah",
      "email": "sana.shah@example.com",
      "password": "S@na_2024"
    },
    {
      "name": "Muhammad Imran",
      "email": "muhammad.imran@example.com",
      "password": "M1mran2025"
    },
    {
      "name": "Sara Tariq",
      "email": "sara.tariq@example.com",
      "password": "S@r@_789"
    },
    {
      "name": "Omar Ali",
      "email": "omar.ali@example.com",
      "password": "0m@r2024"
    },
    {
      "name": "Nida Rehman",
      "email": "nida.rehman@example.com",
      "password": "N!daReh_1"
    },
    {
      "name": "Zainab Anwar",
      "email": "zainab.anwar@example.com",
      "password": "Z@1n@b_05"
    },
    {
      "name": "Hassan Shahid",
      "email": "hassan.shahid@example.com",
      "password": "H@ssan9@8"
    },
    {
      "name": "Rabia Javed",
      "email": "rabia.javed@example.com",
      "password": "R@b!@J@v3d"
    },
    {
      "name": "Ali Raza",
      "email": "ali.raza@example.com",
      "password": "Al!R@z@_10"
    },
    {
      "name": "Mariam Yousuf",
      "email": "mariam.yousuf@example.com",
      "password": "M@rY@_2024"
    },
    {
      "name": "Arslan Shah",
      "email": "arslan.shah@example.com",
      "password": "Arsl@n_25"
    },
    {
      "name": "Nashit Ali",
      "email": "nashit.ali@example.com",
      "password": "N@sh!t_12"
    },
    {
      "name": "Kiran Iqbal",
      "email": "kiran.iqbal@example.com",
      "password": "K!r@1nIq"
    },
    {
      "name": "Tariq Aslam",
      "email": "tariq.aslam@example.com",
      "password": "T@r!qAsl@1"
    },
    {
      "name": "Sadia Raza",
      "email": "sadia.raza@example.com",
      "password": "S@d!aR@z4"
    },
    {
      "name": "Sohail Ahmed",
      "email": "sohail.ahmed@example.com",
      "password": "S0h@!l@H1"
    },
    {
      "name": "Mehak Shahid",
      "email": "mehak.shahid@example.com",
      "password": "M3h@kSh@1d"
    },
    {
      "name": "Shahbaz Khan",
      "email": "shahbaz.khan@example.com",
      "password": "Sh@hb@zK1"
    },
    {
      "name": "Faisal Butt",
      "email": "faisal.butt@example.com",
      "password": "F@is@lB_u10"
    },
    {
      "name": "Noor Fatima",
      "email": "noor.fatima@example.com",
      "password": "N00rF@t1m@"
    },
    {
      "name": "Ahsan Javed",
      "email": "ahsan.javed@example.com",
      "password": "Ahs@nj@v3d"
    },
    {
      "name": "Maryam Bukhari",
      "email": "maryam.bukhari@example.com",
      "password": "M@rY@BuKh@r1"
    },
    {
      "name": "Saad Mehmood",
      "email": "saad.mehmood@example.com",
      "password": "S@ad_M3hm00d"
    },
    {
      "name": "Hina Naz",
      "email": "hina.naz@example.com",
      "password": "H!n@_N@z0"
    },
    {
      "name": "Zeeshan Mustafa",
      "email": "zeeshan.mustafa@example.com",
      "password": "Z33sh@M_20"
    },
    {
      "name": "Mahnoor Siddiqui",
      "email": "mahnoor.siddiqui@example.com",
      "password": "M@hnoor_25"
    },
    {
      "name": "Bilal Yousuf",
      "email": "bilal.yousuf@example.com",
      "password": "B1l@lY0us"
    }
  ]

  const teachers = [
    {
      "name": "Dr. Farhan Iqbal",
      "email": "farhan.iqbal@example.com",
      "password": "DrF@rhan2025",
      "role": "teacher"
    },
    {
      "name": "Ms. Amina Tariq",
      "email": "amina.tariq@example.com",
      "password": "Amin@_T@riq21",
      "role": "teacher"
    },
    {
      "name": "Mr. Imran Shah",
      "email": "imran.shah@example.com",
      "password": "1mr@nSh@h23",
      "role": "teacher"
    },
    {
      "name": "Tariq",
      "email": "tariq@gmail.com",
      "password": "123456",
      "role": "admin"
    }
  ]

  const add = await User.insertMany(teachers)

  res.status(StatusCodes.OK).json("students created successfully")

})


const getMe = asyncHandler(async(req, res) => {

  // const user = req.user;

  const user = await User.create({name: "Tariq", email: "tariq@gmail.com", password: "123456", role: "admin"})

  res.status(StatusCodes.OK).json({user: {name: user.name, email: user.email, role: user.role, isApproved: user.isApproved, id: user._id}})

})

const unApprovedUsers = asyncHandler(async(req, res) => {

  const users = await User.find({isApproved: false});

  if(users.length === 0) throw new NotFoundError("No Users Found");

  res.status(StatusCodes.OK).json({users, msg: "Users Found"})

})

const approveUser = asyncHandler(async(req, res) => {

  const { userId } = req.params


  const user = await User.findOneAndUpdate({_id: userId}, {isApproved: true})

  res.status(StatusCodes.OK).json({msg: "User Approved Successfully"})

});

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  // Get all analytics in one aggregation pipeline
  const analytics = await User.aggregate([
    {
      $facet: {
        // Registered students count
        registeredStudents: [
          { $match: { role: "student", isApproved: true } },
          { $count: "count" },
        ],
        // Registered teachers count
        registeredTeachers: [
          { $match: { role: "teacher", isApproved: true } },
          { $count: "count" },
        ],
        // Unapproved users count
        unapprovedUsers: [
          { $match: { isApproved: false } },
          { $count: "count" },
        ],
        // Student gender distribution
        studentGender: [
          { $match: { role: "student", isApproved: true, gender: { $exists: true } } },
          {
            $group: {
              _id: "$gender",
              count: { $sum: 1 },
            },
          },
        ],
        // Teacher gender distribution
        teacherGender: [
          { $match: { role: "teacher", isApproved: true, gender: { $exists: true } } },
          {
            $group: {
              _id: "$gender",
              count: { $sum: 1 },
            },
          },
        ],
        // Country-wise distribution for students (top 5 + others)
        countryDistribution: [
          {
            $match: {
              role: "student",
              isApproved: true,
              country: { $exists: true, $ne: null },
            },
          },
          {
            $group: {
              _id: "$country",
              students: { $sum: 1 },
            },
          },
          {
            $sort: { students: -1 },
          },
        ],
        // Age ranges for students
        studentAges: [
          { 
            $match: { 
              role: "student", 
              isApproved: true,
              age: { $exists: true, $ne: null }
            } 
          },
          { $project: { age: 1 } },
        ],
      },
    },
  ]);

  const result = analytics[0];

  // Extract counts with default values
  const registeredStudents = result.registeredStudents[0]?.count || 0;
  const registeredTeachers = result.registeredTeachers[0]?.count || 0;
  const unapprovedUsers = result.unapprovedUsers[0]?.count || 0;

  // Calculate student gender ratios
  const studentGenderData = result.studentGender.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const maleStudents = studentGenderData.Male || 0;
  const femaleStudents = studentGenderData.Female || 0;
  const totalStudentsWithGender = maleStudents + femaleStudents;

  const studentMaleRatio =
    totalStudentsWithGender > 0
      ? Math.round((maleStudents / totalStudentsWithGender) * 100)
      : 0;
  const studentFemaleRatio =
    totalStudentsWithGender > 0
      ? Math.round((femaleStudents / totalStudentsWithGender) * 100)
      : 0;

  // Calculate teacher gender ratios
  const teacherGenderData = result.teacherGender.reduce((acc, item) => {
    acc[item._id] = item.count;
    return acc;
  }, {});

  const maleTeachers = teacherGenderData.Male || 0;
  const femaleTeachers = teacherGenderData.Female || 0;
  const totalTeachersWithGender = maleTeachers + femaleTeachers;

  const teacherMaleRatio =
    totalTeachersWithGender > 0
      ? Math.round((maleTeachers / totalTeachersWithGender) * 100)
      : 0;
  const teacherFemaleRatio =
    totalTeachersWithGender > 0
      ? Math.round((femaleTeachers / totalTeachersWithGender) * 100)
      : 0;

  // Calculate age ranges
  const ageRanges = {
    "13-15": 0,
    "16-18": 0,
    "19-21": 0,
    "22-25": 0,
    "25+": 0,
  };

  result.studentAges.forEach((student) => {
    const age = student.age;

    if (age >= 13 && age <= 15) {
      ageRanges["13-15"]++;
    } else if (age >= 16 && age <= 18) {
      ageRanges["16-18"]++;
    } else if (age >= 19 && age <= 21) {
      ageRanges["19-21"]++;
    } else if (age >= 22 && age <= 25) {
      ageRanges["22-25"]++;
    } else if (age > 25) {
      ageRanges["25+"]++;
    }
  });

  const ageRangeData = Object.entries(ageRanges).map(([range, count]) => ({
    range,
    students: count,
  }));

  // Process country distribution - top 5 + others
  const countryData = result.countryDistribution;
  let processedCountryDistribution = [];

  if (countryData.length > 5) {
    // Get top 5 countries
    const top5 = countryData.slice(0, 5).map(item => ({
      country: item._id,
      students: item.students,
    }));

    // Calculate others (sum of remaining countries)
    const othersCount = countryData.slice(5).reduce((sum, item) => sum + item.students, 0);

    processedCountryDistribution = [
      ...top5,
      { country: "Others", students: othersCount }
    ];
  } else {
    // If 5 or fewer countries, return all
    processedCountryDistribution = countryData.map(item => ({
      country: item._id,
      students: item.students,
    }));
  }

  // Return all analytics
  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      registeredStudents,
      registeredTeachers,
      unapprovedUsers,
      studentGenderRatio: {
        male: studentMaleRatio,
        female: studentFemaleRatio,
      },
      teacherGenderRatio: {
        male: teacherMaleRatio,
        female: teacherFemaleRatio,
      },
      ageRanges: ageRangeData,
      countryDistribution: processedCountryDistribution,
    },
  });
});

const saveToken = asyncHandler(async(req, res) => {

    const { fcmToken } = req.body;

    const userId = req.user._id;

    const user = await User.findByIdAndUpdate(userId, { fcmToken });

    await user.save()

    res.status(StatusCodes.OK).json({ msg: "Token saved Successfully"})

})

module.exports = {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  addBulkStudents, 
  getMe,
  unApprovedUsers,
  approveUser,
  getDashboardAnalytics,
  saveToken
};
