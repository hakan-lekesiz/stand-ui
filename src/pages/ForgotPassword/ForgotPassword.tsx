import { useState } from 'react';
import {Avatar,Button,CssBaseline,TextField,Grid,Box,Typography,FormHelperText,Paper,Snackbar} from '@mui/material';
import { Link } from 'react-router-dom';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import loginBg from '../../components/Content/Images/login-bg.jpeg';
import spinner from '../../components/Content/Images/circles-light.svg';
import { useNavigate } from 'react-router-dom';
import useInput from '../../store/use-input';
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

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [state] = useStore();

  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    value: emailValue,
    isValid: emailIsValid,
    isTouched:emailIsTouched,
    validReason: emailValidReason,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(["required", "email"]);

  let formIsValid = false;

  if (emailIsValid) {
    formIsValid = true;
  }

  const submitHandler = (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }
     
    //question05 => https://staging-stand.febir.org/api/v1/user/forgot-password  endpointi 204 dönüyor
    setIsLoading(true);
    fetch(state.globals.routes.forgotPassword, {
      method: 'POST',
      body: JSON.stringify({
        email: emailValue
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
          // question01 => şifre yenileme maili gönderildikten sonra ne yapılacak
          navigate(state.globals.urls.resetPassword);
        }

      })
      .catch((err) => {
        setIsLoading(false);
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
              <HelpOutline />
            </Avatar>
            <Typography component="h1" variant="h5">
              Şifremi Unuttum
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                E-POSTA GÖNDER
                {isLoading && <img src={spinner} className="spinner-01" />}

              </Button>
              <Grid container>
                <Grid item xs>
                  <Link to={state.globals.urls.login}>
                    Giriş Yap
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
