import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import useInput from '../../store/use-input';
import spinner from '../../components/Content/Images/circles-light.svg';
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Autocomplete, CardContent, InputLabel, Divider, TextField, Grid, Snackbar, FormHelperText, Select, MenuItem,CircularProgress } from '@mui/material';


const CreateEditForm = (props: any) => {
  const navigate = useNavigate();
  const [state, dispatch] = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [permissions, setPermissions] = useState<any[]>([]);
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
      getRoleDetails();
    }
  }, []);

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
    value: permissions_ids_Value,
    isValid: permissions_ids_IsValid,
    isTouched: permissions_ids_IsTouched,
    validReason: permissions_ids_ValidReason,
    hasError: permissions_ids_HasError,
    valueChangeHandler: permissions_ids_ChangeHandler,
    inputBlurHandler: permissions_ids_BlurHandler,
    reset: reset_permissions_ids,
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

  const getRoleDetails = async () => {

    const result: any = await fetch(state.globals.routes.roles + "/" + id)
    const resData = await result.json();

    let permissions: any = []
    resData.permissions.map((permis: any) => (
      permissions.push({
        id: permis,
        name: permis
      })
    ));

    nameChangeHandler(resData.name, "setValue");
    permissions_ids_ChangeHandler(permissions.length > 0 ? JSON.stringify(permissions) : "", "setValue");
    user_type_ChangeHandler(resData.user_type_id.toString(), "setValue");

    setIsDetailsFetched(true);
    setShowSpinner(false);
  }

  useEffect(() => {
    getPermissions();

  }, [user_type_Value]);

  const getPermissions = async () => {

    if (user_type_Value) {
      const result: any = await fetch(state.globals.routes.permission + "?user_type_id=" + user_type_Value)
      const resData = await result.json();

      let resPermissions: any[] = [];
      resData.map((item: any) => (
        resPermissions.push({
          id: item.name,
          name: item.name
        })
      ));
      setPermissions(resPermissions);
    }
    else {
      setPermissions([]);
    }
  }

  let formIsValid = false;

  if (nameIsValid && permissions_ids_IsValid && user_type_IsValid) {
    formIsValid = true;
  }

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    let permissions: number[] = []
    JSON.parse(permissions_ids_Value).map((r: any) => (
      permissions.push(r.id)
    ));
    let url = props.mode === "edit" ? ("/" + id) : "";
    //password gönderme boş ise

    let requestBody = {
      name: nameValue,
      user_type_id: parseInt(user_type_Value),
      permissions: permissions
    }

    const result: any = await fetch(state.globals.routes.roles + url, {
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
      navigate(state.globals.urls.roles);
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
            <Grid xs={3}>
              <Grid xs={11}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>
                  Role Adı
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
              <Grid xs={11}
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
                        <MenuItem key={"userTypes_" + item.id} value={item.id}>{item.name}</MenuItem>
                      )
                    })

                  }

                </Select>
                {isFormSubmitted && user_type_HasError && <div><FormHelperText error={true}>{user_type_ValidReason}</FormHelperText></div>}

              </Grid>

            </Grid>
            <Grid xs={9}>
              <Grid xs={12}
                style={{ marginBottom: "15px" }}
              >

                <InputLabel>İzinler</InputLabel>

                <Autocomplete
                  multiple
                  id="tags-outlined"
                  value={permissions_ids_Value ? JSON.parse(permissions_ids_Value) : []}
                  onChange={(event, newValue) => {
                    //aynı option tekrar eklenmiş ise value listesinden ayıklıyoruz
                    const filteredNewValue = newValue.filter((item, index, self) =>
                      index === self.findIndex((t) => (
                        t.id === item.id
                      ))
                    )
                    permissions_ids_ChangeHandler(filteredNewValue.length > 0 ? JSON.stringify(filteredNewValue) : "", "setValue");
                  }}
                  options={permissions}
                  getOptionLabel={(option) => option.name}
                  style={{ width: "100%" }}
                  className={(isFormSubmitted && permissions_ids_HasError) ? "has-error" : ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                    />
                  )}
                  disabled={props.mode === "view" || permissions.length === 0}

                />
                {isFormSubmitted && permissions_ids_HasError && <div><FormHelperText error={true}>{permissions_ids_ValidReason}</FormHelperText></div>}

              </Grid>

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
