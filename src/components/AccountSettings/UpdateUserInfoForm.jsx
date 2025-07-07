import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateUserProfileMutation } from "@services/userApi";
import { useDispatch } from "react-redux";
import { showSnackbar } from "@redux/slices/snackBarSlice";
import TextInput from "@components/FormInputs/TextInput";
import TextareaInput from "@components/FormInputs/TextareaInput";
import FormField from "@components/FormField";
import Button from "@components/Button";
import { useUserInfo } from "@hooks/useUserInfo";

const UpdateUserInfoForm = () => {
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();
  const { about, fullName } = useUserInfo();
  const dispatch = useDispatch();

  const formSchema = yup.object().shape({
    about: yup.string(),
    fullName: yup.string().required(),
  });
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      about,
      fullName,
    },
  });

  async function onSubmit(formValues) {
    try {
      console.log({ formValues });
      await updateUserProfile(formValues).unwrap();
      reset(formValues);
      dispatch(showSnackbar({ message: "Update User Profile Successfully!" }));
    } catch (error) {
      dispatch(showSnackbar({ type: "error", message: error?.data?.message }));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-4">
        <FormField
          name="fullName"
          label="Fullname"
          control={control}
          Component={TextInput}
          error={errors["fullName"]}
        />
        <FormField
          name="about"
          label="About"
          control={control}
          type="textarea"
          Component={TextareaInput}
          error={errors["about"]}
        />
      </div>
      <Button
        variant="contained"
        isLoading={isLoading}
        inputProps={{ disabled: !isDirty, type: "submit" }}
        className="!mt-4"
      >
        Save changes
      </Button>
    </form>
  );
};
export default UpdateUserInfoForm;
