import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { Alert, Button, CircularProgress } from "@mui/material";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import { useRegisterMutation } from "@services/rootApi";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { data = {}, isLoading, isError, error, isSuccess }] =
    useRegisterMutation();

  const onSubmit = (formData) => {
    register(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(showSnackbar({ message: data?.message, severity: "success" }));
      navigate("/login");
    }
  }, [data?.message, isSuccess, dispatch, navigate]);

  return (
    <div>
      <p className="my-1.5 text-xl text-gray-600">Adventure starts here</p>
      <p className="text-sm text-gray-600">
        Make your app management easy and fun!
      </p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormField
          Component={TextInput}
          name={"fullName"}
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
        {isLoading ? (
          <CircularProgress
            className="mx-auto flex items-center justify-center"
            size={24}
          />
        ) : (
          <Button variant="contained" color="primary" type="submit">
            Sign up
          </Button>
        )}

        {isError && <Alert severity="error">{error?.data?.message}</Alert>}
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
