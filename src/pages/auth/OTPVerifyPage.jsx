import FormField from "@components/FormField";
import OTPInput from "@components/FormInputs/OTPInput";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, CircularProgress } from "@mui/material";
import { login } from "@redux/slices/authSlice";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import { useVerifyOTPMutation } from "@services/rootApi";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as yup from "yup";

const OTPVerifyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [verifyOTP, { data = {}, isLoading, isError, error, isSuccess }] =
    useVerifyOTPMutation();

  const formSchema = yup.object().shape({
    otp: yup.string().min(6).required("OTP is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const onSubmit = (formData) => {
    verifyOTP({ email: location.state.email, otp: formData.otp });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(login(data));
      navigate("/");
    }
    if (isError) {
      dispatch(
        showSnackbar({ message: error?.data?.message, severity: "error" }),
      );
    }
  }, [isSuccess, navigate, dispatch, isError, error?.data?.message, data]);

  return (
    <div>
      <p className="my-1.5 text-xl font-bold text-gray-900">
        Two-Step Verification
      </p>
      <p className="text-sm text-gray-600">
        We sent a verification code to your email. Enter the code from the email
        in the field below.
      </p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <p className="text-sm text-gray-600"></p>
        <FormField
          Component={OTPInput}
          name={"otp"}
          control={control}
          label={"Please enter the 6-digit code sent to your email."}
          type={"password"}
          error={errors["otp"]}
        />
        {isLoading ? (
          <CircularProgress
            className="mx-auto flex items-center justify-center"
            size={24}
          />
        ) : (
          <Button variant="contained" color="primary" type="submit">
            Verify OTP
          </Button>
        )}
      </form>
      <p className="mt-4 text-center">
        Did not get the code{" "}
        <Link className="text-[#246AA3]" to={"#"}>
          Resend
        </Link>
      </p>
    </div>
  );
};

export default OTPVerifyPage;
