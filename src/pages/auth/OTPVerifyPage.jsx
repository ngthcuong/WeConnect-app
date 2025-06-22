import FormField from "@components/FormField";
import OTPInput from "@components/FormInputs/OTPInput";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const OTPVerifyPage = () => {
  const { control } = useForm();
  return (
    <div>
      <p className="my-1.5 text-xl font-bold text-gray-900">
        Two-Step Verification
      </p>
      <p className="text-sm text-gray-600">
        We sent a verification code to your mobile. Enter the code from the
        mobile in the field below.
      </p>
      <p>Your phone: ....</p>
      <form className="mt-6 flex flex-col gap-4">
        <p className="text-sm text-gray-600"></p>
        <FormField
          Component={OTPInput}
          name={"otp"}
          control={control}
          label={"Please enter the 6-digit code sent to your mobile number."}
          type={"password"}
        />
        <Button variant="contained" color="primary">
          Verify OTP
        </Button>
      </form>
      <p className="mt-4 text-center">
        Did not get the code{" "}
        <Link className="text-[#246AA3]" to={"/login"}>
          Resend
        </Link>
      </p>
    </div>
  );
};

export default OTPVerifyPage;
