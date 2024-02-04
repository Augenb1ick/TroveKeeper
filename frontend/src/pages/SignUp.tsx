import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CollectionsIcon from '@mui/icons-material/Collections';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

import { SubmitHandler, useForm } from 'react-hook-form';
import { AuthFormValues } from '../types/dataTypes/FormValues';
import { EMAIL_PATTERN } from '../utills/constants';
import { FC, useState } from 'react';
import { reformFormData } from '../utills/formDataReformer';
import { managingUsersApi } from '../utills/api/usersApi';
import { useNavigate } from 'react-router-dom';
import { useSnackBars } from '../context/SnackBarsContext';
import { IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ChangeLanguageButtons from '../Components/ChangeLanguageButtons';

const SignUp: FC = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'auth' });

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const { handleErrorSnackOpen, handleSuccessSnackOpen } = useSnackBars();

    const {
        register,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<AuthFormValues>({ mode: 'onChange' });

    const handleSignup = (signupData: AuthFormValues) => {
        setIsLoading(true);
        managingUsersApi
            .register(signupData)
            .then((res) => {
                if (res) {
                    handleSuccessSnackOpen(t('successSignUpMessage'));
                    navigate('/signin', { replace: true });
                }
            })
            .catch((err) => {
                handleErrorSnackOpen(t(err) || t('signUpError'));
            })
            .finally(() => setIsLoading(false));
    };

    const onSubmit: SubmitHandler<AuthFormValues> = (data) => {
        handleSignup(reformFormData(data));
    };

    return (
        <Container component='main' maxWidth='xs'>
            <Box
                sx={{
                    marginTop: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Box width='100%' display='flex' justifyContent='flex-end'>
                    <ChangeLanguageButtons />
                </Box>
                <IconButton
                    onClick={() => navigate('/')}
                    sx={{ m: 1, color: 'primary' }}
                >
                    <CollectionsIcon />
                </IconButton>
                <Typography component='h1' variant='h5'>
                    {t('signUp')}
                </Typography>
                <Box
                    component='form'
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{ mt: 3 }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                {...register('name', {
                                    required: t('required'),
                                })}
                                autoComplete='given-name'
                                required
                                fullWidth
                                label={t('username')}
                                error={!errors?.name?.message ? false : true}
                                helperText={
                                    (errors?.name?.message as string) || ''
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('email', {
                                    required: t('required'),
                                    pattern: {
                                        value: EMAIL_PATTERN,
                                        message: t('patternEmail'),
                                    },
                                })}
                                required
                                fullWidth
                                autoComplete='off'
                                label={t('email')}
                                error={!errors?.email?.message ? false : true}
                                helperText={
                                    (errors?.email?.message as string) || ''
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                {...register('password', {
                                    required: t('required'),
                                })}
                                required
                                fullWidth
                                autoComplete='off'
                                label={t('password')}
                                type='password'
                                error={
                                    !errors?.password?.message ? false : true
                                }
                                helperText={
                                    (errors?.password?.message as string) || ''
                                }
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type='submit'
                        disabled={!isValid || isLoading}
                        fullWidth
                        variant='contained'
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {t('signUpButton')}
                    </Button>
                    <Grid container justifyContent='center'>
                        <Grid item>
                            <Link href='/signin' variant='body2'>
                                {t('haveAcc')}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default SignUp;
