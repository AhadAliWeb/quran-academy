// import { useEffect } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router";
// import { setUserInfo } from "../slices/userSlice";


// const useCheckUser = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios
//       .get("/api/v1/users/me")
//       .then((res) => {
//         const { name, email, isApproved, role } = res.data.user;

//         dispatch(setUserInfo({ name, email, isApproved, role }));

        
//         if (!isApproved) {
//           navigate("/confirmation");
//         }

//       })
//       .catch((err) => {
//         console.log(err);
//         navigate("/login")
//       })


//   }, [dispatch, navigate]);
// };

// export default useCheckUser;