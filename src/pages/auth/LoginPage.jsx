import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const { control } = useForm();
  return (
    <div>
      <p className="my-1.5 text-xl text-gray-600">Welcome to WeConnect!</p>
      <p className="text-sm text-gray-600">
        Please sign in to your account and start the adventure!
      </p>
      <form className="mt-6 flex flex-col gap-4">
        <FormField
          Component={TextInput}
          name={"email"}
          control={control}
          label={"Email"}
        />
        <FormField
          Component={TextInput}
          name={"password"}
          control={control}
          label={"Password"}
          type={"password"}
        />
        <Button variant="contained" color="primary">
          Sign in
        </Button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link className="text-[#246AA3]" to={"/register"}>
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
