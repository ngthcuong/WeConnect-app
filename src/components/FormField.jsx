import { FormHelperText } from "@mui/material";
import { Controller } from "react-hook-form";

// eslint-disable-next-line no-unused-vars
const FormField = ({ control, label, name, type, Component, error }) => {
  return (
    <div>
      <p className="text-dark-100 mb-1 text-sm font-bold">{label}</p>
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, name } }) => {
          return (
            <Component
              onChange={onChange}
              value={value}
              name={name}
              type={type}
              control={control}
              error={error?.message}
            />
          );
        }}
      />
      {error?.message && <FormHelperText error>{error.message}</FormHelperText>}
    </div>
  );
};
export default FormField;
