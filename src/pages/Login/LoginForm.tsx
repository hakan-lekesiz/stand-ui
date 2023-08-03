import React, { useState, useContext } from 'react';
import {Avatar,Button,CssBaseline,TextField,FormControlLabel,Checkbox,Grid,Box,Typography,FormHelperText,Paper,Snackbar} from '@mui/material';
import { Link } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import loginBg from '../../components/Content/Images/login-bg.jpeg';
import spinner from '../../components/Content/Images/circles-light.svg';
import { useNavigate } from 'react-router-dom';
import useInput from '../../store/use-input';
import AuthContext from '../../store/auth-context';
import { useStore } from '../../store/store';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link to='/'>
        Stand
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function LoginForm() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [state] = useStore();


  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    value: emailValue,
    isValid: emailIsValid,
    isTouched: emailIsTouched,
    validReason: emailValidReason,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput(["required", "email"]);

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    isTouched: passwordIsTouched,
    validReason: passwordValidReason,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(["required"]);

  let formIsValid = false;

  if (emailIsValid && passwordIsValid) {
    formIsValid = true;
  }

  const submitHandler = (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }
    setIsLoading(true);
    fetch(state.globals.routes.login, {
      method: 'POST',
      body: JSON.stringify({
        email: emailValue,
        password: passwordValue
      }),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json, text/plain, */*'
      },
    })
      .then((res) => {
        setIsLoading(false);
        if (res.ok) {
          return res.json();
        }
        else {
          return res.json().then((data) => {
            setErrorMessage(data.message);
            setShowError(true);
          });
        }
      })
      .then((data) => {
        if (data) {
          const expirationTime = new Date(
            new Date().getTime() + state.globals.loginExpirationTime * 1000
          );
          authCtx.login(data, expirationTime);
          navigate(state.globals.urls.clients);
        }

      })
      .catch((err) => {
        setIsLoading(true);
        console.log(err.message);
      });
  };

  return (

    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(" + loginBg + ")",
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Giriş
            </Typography>
            <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 1 }} className="custom-form-01">
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="E-Posta"
                name="email"
                autoComplete="email"
                autoFocus
                value={emailValue}
                onChange={emailChangeHandler}
                onBlur={emailBlurHandler}
                className={(isFormSubmitted && emailHasError) ? "has-error" : ""}
              />
              {isFormSubmitted && emailHasError && <div><FormHelperText error={true}>{emailValidReason}</FormHelperText></div>}

              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Şifre"
                type="password"
                id="password"
                autoComplete="current-password"
                value={passwordValue}
                onChange={passwordChangeHandler}
                onBlur={passwordBlurHandler}
                className={(isFormSubmitted && passwordHasError) ? "has-error" : ""}
              />
              {isFormSubmitted && passwordHasError && <div><FormHelperText error={true}>{passwordValidReason}</FormHelperText></div>}

              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Beni Hatırla"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                GİRİŞ YAP
                {isLoading && <img src={spinner} className="spinner-01" />}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to={state.globals.urls.forgotPassword}>
                    Şifremi Unuttum
                  </Link>
                </Grid>

              </Grid>
              <Copyright sx={{ mt: 5 }} />

              <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={showError}
                onClose={() => setShowError(false)}
                message={errorMessage}
                key={'bottom' + 'right'}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
