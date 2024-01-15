import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import * as zodValidator from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector, useDispatch } from 'react-redux';


import history from '../../helpers/History';
import { authActions } from '../../store';
import SignIn from '../../components/SignIn';
import { Box } from '@mui/material';
import { LoginFormInput } from '../../types/GlobalTypes';

const Login = () => {
    const dispatch = useDispatch();
    const authUser = useSelector((x: any) => x.auth.user);
    const authError = useSelector((x: any) => x.auth.error);

    useEffect(() => {
        if (authUser) history.navigate('/');
    }, []);


    const validationSchema = zodValidator
        .object({
            username: zodValidator.string().min(1, "Username is required"),
            password: zodValidator.string().min(1, "Password is required"),
        })
        .required();


    // get functions to build form with useForm() hook
    const {
        handleSubmit,
        control,
        formState: { errors },
      } = useForm<LoginFormInput>({
        resolver: zodResolver(validationSchema),
      });

    function onSubmit({ username, password }: LoginFormInput) {
        return dispatch(authActions.login({ username, password }));
    }

    return (
        <Box m="20px">
            {/* HEADER */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <SignIn control={control} onSubmit={handleSubmit(onSubmit)} error={authError?.message}/>
            </Box>
        </Box>

    )
}

export default Login;
