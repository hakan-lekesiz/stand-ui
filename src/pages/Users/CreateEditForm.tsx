import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import useInput from '../../store/use-input';
import spinner from '../../components/Content/Images/circles-light.svg';
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Autocomplete, CardContent, InputLabel, Divider, TextField, Grid, Snackbar, FormHelperText, Select, MenuItem,CircularProgress } from '@mui/material';
import { PhoneMask } from "../../components/Inputs/Masks";


const CreateEditForm = (props: any) => {
  const navigate = useNavigate();
  const [state, dispatch] = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [roles, setRoles] = useState<any[]>([]);
  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  let { id } = useParams<"id">();
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isDetailsFetched, setIsDetailsFetched] = useState<boolean>(false);

  useEffect(() => {

    if (state.globals.formDatas.userTypes.length > 0) {
      if (id && (props.mode === "edit" || props.mode === "view")) {
        if (isDetailsFetched) {
          setShowSpinner(false);
        }
      }
      else {
        setShowSpinner(false);
      }
    }
    else {
      setTimeout(() => {
        dispatch('SET_UPDATE');
      }, 1000);
    }
  }, [state]);

  useEffect(() => {
    if (id && (props.mode === "edit" || props.mode === "view")) {
      getUserDetails();
    }
  }, []);

  const getUserDetails = async () => {

    const result: any = await fetch(state.globals.routes.users + "/" + id)
    const resData = await result.json();

    nameChangeHandler(resData.name, "setValue");
    emailChangeHandler(resData.email, "setValue");
    phoneChangeHandler(resData.phone, "setValue");
    //ids yapılacak
    let userRoles: any = []
    resData.roles.map((r: any) => (
      userRoles.push({
        id: r.id,
        name: r.name
      })
    ));

    role_id_ChangeHandler(userRoles.length > 0 ? JSON.stringify(userRoles) : "", "setValue");
    user_type_ChangeHandler(resData.user_type_id.toString(), "setValue");
    phoneChangeHandler(resData.phone, "setValue");

    const accountStatusValue = resData.deleted_at === null ? "1" : "0";
    accountStatusChangeHandler(accountStatusValue, "setValue");

    setIsDetailsFetched(true);
    setShowSpinner(false);
  }

  const {
    value: nameValue,
    isValid: nameIsValid,
    isTouched: nameIsTouched,
    validReason: nameValidReason,
    hasError: nameHasError,
    valueChangeHandler: nameChangeHandler,
    inputBlurHandler: nameBlurHandler,
    reset: resetName,
  } = useInput(["required"]);

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
    value: phoneValue,
    isValid: phoneIsValid,
    isTouched: phoneIsTouched,
    validReason: phoneValidReason,
    hasError: phoneHasError,
    valueChangeHandler: phoneChangeHandler,
    inputBlurHandler: phoneBlurHandler,
    reset: resetPhone,
  } = useInput(["required", "exact:10"]);

  const {
    value: role_id_Value,
    isValid: role_id_IsValid,
    isTouched: role_id_IsTouched,
    validReason: role_id_ValidReason,
    hasError: role_id_HasError,
    valueChangeHandler: role_id_ChangeHandler,
    inputBlurHandler: role_id_BlurHandler,
    reset: reset_role_id,
  } = useInput(["required"]);

  const {
    value: user_type_Value,
    isValid: user_type_IsValid,
    isTouched: user_type_IsTouched,
    validReason: user_type_ValidReason,
    hasError: user_type_HasError,
    valueChangeHandler: user_type_ChangeHandler,
    inputBlurHandler: user_type_BlurHandler,
    reset: reset_user_type,
  } = useInput(["required"]);

  const {
    value: accountStatusValue,
    isValid: accountStatusIsValid,
    isTouched: accountStatusIsTouched,
    validReason: accountStatusValidReason,
    hasError: accountStatusHasError,
    valueChangeHandler: accountStatusChangeHandler,
    inputBlurHandler: accountStatusBlurHandler,
    reset: resetAccountStatus,
  } = useInput(["required"]);

  const {
    value: passwordValue,
    isValid: passwordIsValid,
    isTouched: passwordIsTouched,
    validReason: passwordValidReason,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput(["required", "password"]);

  useEffect(() => {
    getRoles();

  }, [user_type_Value]);

  const getRoles = async () => {
    if (user_type_Value) {
      const result: any = await fetch(state.globals.routes.getAllUserRoles + "?user_type_id=" + user_type_Value)
      const resData = await result.json();
      let resRoles: any[] = [];
      resData.map((item: any) => (
        resRoles.push({
          id: item.id,
          name: item.name
        })
      ));
      setRoles(resRoles);
    }
    else {
      setRoles([]);
    }
  }

  let formIsValid = false;

  if (emailIsValid && nameIsValid && phoneIsValid && role_id_IsValid && user_type_IsValid && accountStatusIsValid && (passwordIsValid || props.mode === "edit")) {
    formIsValid = true;
  }
  if (!passwordIsValid && props.mode === "edit" && passwordValue.length > 0) {
    formIsValid = false;
  }
  const submitHandler = async (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    let userRoles: number[] = []
    JSON.parse(role_id_Value).map((r: any) => (
      userRoles.push(parseInt(r.id))
    ));
    let url = props.mode === "edit" ? ("/" + id) : "";
    //password gönderme boş ise

    let requestBody = {};
    if (passwordValue !== "") {
      requestBody = {
        name: nameValue,
        email: emailValue,
        password: passwordValue,
        phone: phoneValue,
        user_type_id: parseInt(user_type_Value),
        roles: userRoles
      }
    }
    else {
      requestBody = {
        name: nameValue,
        email: emailValue,
        phone: phoneValue,
        user_type_id: parseInt(user_type_Value),
        roles: userRoles
      }
    }

    const result: any = await fetch(state.globals.routes.users + url, {
      method: props.mode === "edit" ? 'PUT' : 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
    })

    const resData = await result.json();
    setIsLoading(false);

    if (result.ok) {
      navigate(state.globals.urls.users);
    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }
  };
  if (!showSpinner) {
    return (
      <>
        <CardContent>

          <Box component="form" noValidate sx={{ mt: 1, display: "flex" }}>
            <Grid xs={6}>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>
                  Adı Soyadı
                </InputLabel>
                <TextField
                  fullWidth
                  id="name"
                  name="name"
                  autoComplete="name"
                  autoFocus
                  value={nameValue}
                  onChange={nameChangeHandler}
                  onBlur={nameBlurHandler}
                  className={(isFormSubmitted && nameHasError) ? "has-error" : ""}
                  disabled={props.mode === "view"}
                />
                {isFormSubmitted && nameHasError && <div><FormHelperText error={true}>{nameValidReason}</FormHelperText></div>}

              </Grid>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>
                  E-Posta
                </InputLabel>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  autoComplete="email"
                  value={emailValue}
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  className={(isFormSubmitted && emailHasError) ? "has-error" : ""}
                  disabled={props.mode === "view"}
                />
                {isFormSubmitted && emailHasError && <div><FormHelperText error={true}>{emailValidReason}</FormHelperText></div>}

              </Grid>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>
                  Telefon
                </InputLabel>
                <PhoneMask
                  phoneValue={phoneValue}
                  phoneChangeHandler={(maskedData: any) => phoneChangeHandler(maskedData, "mask")}
                  phoneBlurHandler={phoneBlurHandler}
                  isFormSubmitted={isFormSubmitted}
                  disabled={props.mode === "view"}
                  phoneHasError={phoneHasError} />
                {isFormSubmitted && phoneHasError && <div><FormHelperText error={true}>{phoneValidReason}</FormHelperText></div>}

              </Grid>
            </Grid>

            <Grid xs={6}>

              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >

                <InputLabel>Yetkili Türü</InputLabel>
                <Select sx={{ width: "100%" }}
                  id="user_type"
                  name="user_type"
                  value={user_type_Value}
                  onChange={user_type_ChangeHandler}
                  onBlur={user_type_BlurHandler}
                  className={(isFormSubmitted && user_type_HasError) ? "has-error" : ""}
                  disabled={props.mode === "view"}
                >

                  {
                    state.globals.formDatas.userTypes.map((item: any) => {

                      return (
                        <MenuItem key={"user_type_" + item.id} value={item.id}>{item.name}</MenuItem>
                      )
                    })

                  }

                </Select>
                {isFormSubmitted && user_type_HasError && <div><FormHelperText error={true}>{user_type_ValidReason}</FormHelperText></div>}

              </Grid>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >

                <InputLabel>Rolü</InputLabel>

                <Autocomplete
                  multiple
                  id="tags-outlined"
                  value={role_id_Value ? JSON.parse(role_id_Value) : []}
                  onChange={(event, newValue) => {
                    //aynı option tekrar eklenmiş ise value listesinden ayıklıyoruz
                    const filteredNewValue = newValue.filter((item, index, self) =>
                      index === self.findIndex((t) => (
                        t.id === item.id
                      ))
                    )
                    role_id_ChangeHandler(filteredNewValue.length > 0 ? JSON.stringify(filteredNewValue) : "", "setValue");
                  }}
                  options={roles}
                  getOptionLabel={(option) => option.name}
                  style={{ width: "100%" }}
                  className={(isFormSubmitted && role_id_HasError) ? "has-error" : ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                    />
                  )}
                />
                {isFormSubmitted && role_id_HasError && <div><FormHelperText error={true}>{role_id_ValidReason}</FormHelperText></div>}

              </Grid>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >

                <InputLabel>Hesap Durumu</InputLabel>
                <Select sx={{ width: "100%" }}
                  id="accountStatus"
                  name="accountStatus"
                  value={accountStatusValue}
                  onChange={accountStatusChangeHandler}
                  onBlur={accountStatusBlurHandler}
                  placeholder="Seçiniz"
                  className={(isFormSubmitted && accountStatusHasError) ? "has-error" : ""}
                  disabled={props.mode === "view"}
                >
                  {
                    state.globals.formDatas.accountStatusUserAdd.map((item: any) => {

                      return (
                        <MenuItem key={"accountStatus_" + item.id} value={item.id}>{item.name}</MenuItem>
                      )
                    })

                  }

                </Select>
                {isFormSubmitted && accountStatusHasError && <div><FormHelperText error={true}>{accountStatusValidReason}</FormHelperText></div>}

              </Grid>
              {
                props.mode !== "view" &&
                <Grid xs={8}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel>
                    Şifre
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={passwordValue}
                    onChange={passwordChangeHandler}
                    onBlur={passwordBlurHandler}
                    className={(isFormSubmitted && passwordHasError && (props.mode !== "edit" || (props.mode === "edit" && passwordValue.length > 0))) ? "has-error" : ""}
                  />
                  {isFormSubmitted && passwordHasError && props.mode !== "edit" && <div><FormHelperText error={true}>{passwordValidReason}</FormHelperText></div>}
                  {isFormSubmitted && passwordHasError && props.mode === "edit" && passwordValue.length > 0 && <div><FormHelperText error={true}>{passwordValidReason}</FormHelperText></div>}


                </Grid>
              }

            </Grid>

          </Box>

        </CardContent>
        <Divider />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            p: 2
          }}
        >

          {
            props.mode !== "view" &&
            <Button
              color="primary"
              variant="contained"
              onClick={submitHandler}
            >
              {
                props.mode === "create" &&
                "EKLE"
              }
              {
                props.mode === "edit" &&
                "KAYDET"
              }
              {isLoading && <img src={spinner} className="spinner-01" />}
            </Button>
          }





        </Box>


        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          open={showError}
          onClose={() => setShowError(false)}
          message={errorMessage}
          key={'bottom' + 'right'}
        />
      </>
    );
  }
  else {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

};

export default CreateEditForm;
