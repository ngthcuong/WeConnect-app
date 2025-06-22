import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { Button } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  const { control } = useForm();

  return (
    <div className="flex h-screen flex-col items-center justify-center rounded-2xl bg-[#F8F7FA]">
      <div className="h-fit w-[450px] bg-white p-8">
        <img src="/weconnect-logo.png" className="mx-auto mb-4" />
        <p className="text-center text-2xl font-bold">Register</p>
        <form className="flex flex-col gap-4">
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
        <p className="mt-4">
          Already have an account{" "}
          <Link className="text-[#246AA3]" to={"/login"}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
