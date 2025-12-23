// import { useMutation } from "@tanstack/react-query";
// import { loginAction } from "../actions/actions";
// import { loginTypes } from "../actions/actionTypes";

// export const useLogin = () => {
//     return useMutation({
//         mutationFn: (data: loginTypes) => loginAction(data),
//         onSuccess: (result) => {
//           console.log(result, result.data.access_token);
//           login(result.data.access_token);
//           const access_token = result.data.access_token;
//           localStorage.setItem("accessToken", access_token);
//           console.log(decodeAccessToken(result.data.access_token));
//           toast.success("User Loggedin");
//           router.push("/");
//         },
//         onError: (err) => {
//           console.log("Signup failed:", err);
//         },
//       });
// }