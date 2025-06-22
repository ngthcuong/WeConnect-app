import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const { control } = useForm();

  return (
    <div>
      <p className="my-1.5 text-xl text-gray-600">Adventure starts here</p>
      <p className="text-sm text-gray-600">
        Make your app management easy and fun!
      </p>
      <form className="mt-6 flex flex-col gap-4">
        <FormField
          Component={TextInput}
          name={"fullname"}
          control={control}
          label={"Full Name"}
        />
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
          Sign up
        </Button>
      </form>
      <p className="mt-4 text-center">
        Already have an account{" "}
        <Link className="text-[#246AA3]" to={"/login"}>
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
