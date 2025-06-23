import FormField from "@components/FormField";
import TextInput from "@components/FormInputs/TextInput";
import { Alert, Button, CircularProgress } from "@mui/material";
import { useLoginMutation } from "@services/rootApi";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import { useDispatch } from "react-redux";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { data = {}, isLoading, isError, error, isSuccess }] =
    useLoginMutation();

  // Form validation cho form
  const formSchema = yup.object().shape({
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
    getValues,
    formState: { errors },
  } = useForm({ resolver: yupResolver(formSchema) });

  const onSubmit = (formData) => {
    login(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(showSnackbar({ message: data?.message, severity: "success" }));
      navigate("/verify-otp", { state: { email: getValues("email") } });
    }
    if (isError) {
      dispatch(
        showSnackbar({ message: error?.data?.message, severity: "error" }),
      );
    }
  }, [
    isSuccess,
    navigate,
    dispatch,
    data?.message,
    isError,
    error?.data?.message,
    getValues,
  ]);

  return (
    <div>
      <p className="my-1.5 text-xl text-gray-600">Welcome to WeConnect!</p>
      <p className="text-sm text-gray-600">
        Please sign in to your account and start the adventure!
      </p>
      <form
        className="mt-6 flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
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
            Sign in
          </Button>
        )}
        {/* {isError && <Alert severity="error">{error?.data?.message}</Alert>} */}
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
