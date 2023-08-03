import { useState, useContext } from 'react';
import {Avatar,Button,CssBaseline,TextField,Grid,Box,Typography,FormHelperText,Paper,Snackbar} from '@mui/material';

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import loginBg from '../../components/Content/Images/login-bg.jpeg';
import spinner from '../../components/Content/Images/circles-light.svg';
import { useNavigate,useLocation ,  Link } from 'react-router-dom';
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [state] = useStore();
  const query = new URLSearchParams(useLocation().search);
  const id = query.get("id");
  const code = query.get("code");
  
  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    value: password1Value,
    isValid: password1IsValid,
    isTouched:password1IsTouched,
    validReason: password1ValidReason,
    hasError: password1HasError,
    valueChangeHandler: password1ChangeHandler,
    inputBlurHandler: password1BlurHandler,
    reset: resetPassword1,
  } = useInput(["required","password"]);
  
  const {
    value: password2Value,
    isValid: password2IsValid,
    isTouched:password2IsTouched,
    validReason: password2ValidReason,
    hasError: password2HasError,
    valueChangeHandler: password2ChangeHandler,
    inputBlurHandler: password2BlurHandler,
    reset: resetPassword2,
  } = useInput(["required","password"]);
  
  let formIsValid = false;

  if (password1IsValid && password2IsValid) {
    formIsValid = true;
  }

  const submitHandler = (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }
 
    if (!id && !code) {
      //question02 => reset pass sayfasında code veya id yoksa ne olacak
      return;
    }
    if (password1Value !== password1Value) {
      return;
    }

    setIsLoading(true);
    fetch(state.globals.routes.resetPassword, {
      method: 'POST',
      body: JSON.stringify({
        id: id,
        code: code,
        password: password1Value,
        password_confirmation: password1Value
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
          navigate(state.globals.urls.clients);
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
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Şifremi Yenile
            </Typography>
            <Box component="form" noValidate onSubmit={submitHandler} sx={{ mt: 1 }} className="custom-form-01">
              <TextField
                margin="normal"
                fullWidth
                autoFocus
                name="password"
                label="Şifre"
                type="password"
                id="password1"
                autoComplete="current-password"
                value={password1Value}
                onChange={password1ChangeHandler}
                onBlur={password1BlurHandler}
                className={(isFormSubmitted && password1HasError) ? "has-error" : ""}
              />
              {isFormSubmitted && password1HasError && <div><FormHelperText error={true}>{password1ValidReason}</FormHelperText></div>}



              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Şifre Tekrar"
                type="password"
                id="password2"
                autoComplete="current-password"
                value={password2Value}
                onChange={password2ChangeHandler}
                onBlur={password2BlurHandler}
                className={(isFormSubmitted && password2HasError) ? "has-error" : ""}
              />
              {isFormSubmitted && password2HasError && <div><FormHelperText error={true}>{password2ValidReason}</FormHelperText></div>}
              {isFormSubmitted && !password2HasError && password1Value !== password2Value &&password2IsTouched&& <div>
                <FormHelperText error={true}>
                  {
                    "Şifreler eşleşmiyor"
                  }
                </FormHelperText></div>}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                ŞİFREMİ YENİLE
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
