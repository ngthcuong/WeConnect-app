import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { Alert, Button, CircularProgress } from "@mui/material";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import { useRegisterMutation } from "@services/rootApi";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { data = {}, isLoading, isError, error, isSuccess }] =
    useRegisterMutation();

  // Form validation cho form
  const formSchema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup
      .string()
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is not valid",
      )
      .required("Email is not valid"),
    password: yup.string().min(6).required("Password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
  });

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
          error={errors["fullName"]}
        />
        <FormField
          Component={TextInput}
          name={"email"}
          control={control}
          label={"Email"}
          error={errors["email"]}
        />
        <FormField
          Component={TextInput}
          name={"password"}
          control={control}
          label={"Password"}
          type={"password"}
          error={errors["password"]}
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
