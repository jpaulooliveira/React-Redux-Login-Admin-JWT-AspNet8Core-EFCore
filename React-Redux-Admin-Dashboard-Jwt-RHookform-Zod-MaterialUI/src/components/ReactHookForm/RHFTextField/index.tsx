import { Controller, FieldValues } from "react-hook-form";
import TextField, { TextFieldProps } from "@mui/material/TextField";

interface RHFTextFieldProps extends Omit<TextFieldProps, "name" | "label"> {
  name: string;
  control: any;
  label: string;
}

const RHFTextField: React.FC<RHFTextFieldProps> = ({
  name,
  control,
  label,
  ...rest
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
        <TextField
          {...rest}
          helperText={error ? error.message : null}          
          error={!!error}
          onChange={onChange}
          value={value}
          label={label}
        />
      )}
    />
  );
};

export default RHFTextField;    