import React from "react";
import logo from "../assets/3771.jpg";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import * as Yup from "yup";
import YupPassword from "yup-password";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../Redux/userSlice";
import { useDispatch, useSelector } from "react-redux";

YupPassword(Yup);

function SignUp(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Name is requried"),
    email: Yup.string()
      .required("Email is requried")
      .matches(/@[^.]*\./, "Enter a proper Email address"),
    password: Yup.string()
      .required("Password is requried")
      .min(
        8,
        "Password must contain 8 or more characters with at least one of each: uppercase, lowercase, number and special"
      )
      .minLowercase(1, "Password must contain at least 1 lower case letter")
      .minUppercase(1, "Password must contain at least 1 upper case letter")
      .minNumbers(1, "Password must contain at least 1 number")
      .minSymbols(1, "Password must contain at least 1 special character"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      dispatch(signInStart());
      await axios
        .post("http://localhost:4000/api/auth/sign-up", values)
        .then((res) => {
          if (res.data.success == true) {
            toast.success(res.data.message);
            dispatch(signInSuccess(res.data.result));
            localStorage.setItem("Token", res.data.token);
            navigate("/");
          }
        })
        .catch((error) => {
          toast.error(error.data.message);
          dispatch(signInFailure(error.message));
        });
    },
  });

  return (
    <>
      <div className="tw-w-full tw-bg-primary md:tw-h-[90vh] tw-h-full tw-py-5 tw-flex tw-flex-col md:tw-flex-row  tw-gap-4 tw-justify-center">
        <div className="tw-m-auto md:tw-w-[40%] tw-w-full tw-flex tw-flex-col tw-gap-3">
          <h1 className="tw-text-quaternary tw-font-bold md:tw-text-4xl tw-text-2xl md:tw-leading-normal tw-leading-normal md:tw-text-start tw-text-center">
            <span className="tw-bg-quaternary tw-border-solid tw-border-2 tw-rounded-2xl tw-text-primary tw-p-1 tw-mr-2">
              {" "}
              Unleash the Love!{" "}
            </span>
            Sign Up to Adopt Your New Pet
          </h1>
          <h6 className="tw-text-quaternary tw-font-semibold tw-text-md tw-hidden md:tw-block">
            Make a life-changing difference for a deserving animal. Sign up to
            browse adoptable pets and find your new best friend.
          </h6>
          <div className="tw-text-start ">
            <h3 className="tw-text-quaternary tw-underline tw-underline-offset-2">
              Already have any account?{" "}
              <span className="tw-font-bold tw-bg-quaternary tw-border-solid tw-border-2 tw-rounded-2xl tw-text-primary tw-p-1 tw-mr-2">
                <Link to="/signin">Sign-in</Link>
              </span>
            </h3>
          </div>
        </div>
        <div className="card tw-w-[90%] md:tw-w-[30%] tw-h-[90%] tw-m-auto tw-overflow-auto tw-p-5 tw-rounded-2xl signup tw-text-start">
          <img
            src={logo}
            className="card-img-top tw-h-[30%] tw-w-[40%] tw-mx-auto"
            alt="Dog Img"
          />
          <div className="card-body ">
            <form onSubmit={formik.handleSubmit}>
              <div className="tw-mt-3">
                <label className="form-label">
                  Name <span className="tw-text-red-700">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="text-danger">
                <p>{formik.errors.username}</p>
              </div>
              <div className="tw-mt-3">
                <label className="form-label">
                  Email <span className="tw-text-red-700">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="text-danger">
                <p>{formik.errors.email}</p>
              </div>
              <div className="tw-mt-3">
                <label className="form-label">
                  Password <span className="tw-text-red-700">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="text-danger">
                <p>{formik.errors.password}</p>
              </div>
              <div className="tw-text-center">
                <button
                  disabled={loading}
                  type="submit"
                  className="btn tw-mt-3 tw-text-primary hover:tw-bg-primary hover:tw-text-quaternary tw-border-primary tw-font-bold tw-border-2 tw-w-[70%]"
                >
                  {loading ? "Loading" : "Sign Up to Adopt!"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default SignUp;
