import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import useInput from '../../store/use-input';
import spinner from '../../components/Content/Images/circles-light.svg';
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Autocomplete, CardContent, InputLabel, Divider, TextField, Grid, Snackbar, FormHelperText, CircularProgress, MenuItem } from '@mui/material';
import { ILocation } from "../../models/Locations";
import { DecimalMask } from "../../components/Inputs/Masks";
import FormDialog from "../../components/Dialogs/FormDialog";
import Step1CreateEdit from "../Clients/Step1CreateEdit";
import Step2Locations from "../Clients/Step2Locations";


const CreateEditForm = (props: any) => {
  const navigate = useNavigate();
  const [state, dispatch] = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [clientSearchInputValue, setClientSearchInputValue] = useState<string>("");
  const [locationSearchInputValue, setLocationSearchInputValue] = useState<string>("");
  const [clientOptions, setClientOptions] = useState<any[]>([]);
  const [locationOptions, setLocationOptions] = useState<any[]>([]);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isDetailsFetched, setIsDetailsFetched] = useState<boolean>(false);

  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  let { id } = useParams<"id">();

  const [addclientDialogModal, setAddclientDialogModal] = useState<boolean>(false);
  const [addLocationDialogModal, setAddLocationDialogModal] = useState<boolean>(false);

  useEffect(() => {
    if (id && (props.mode === "edit" || props.mode === "view")) {
      getEducationDetails();
    }
  }, []);

  useEffect(() => {

    if (state.globals.formDatas.seminarSubjectOptions.length > 0 && state.globals.formDatas.seminarStatusOptions.length > 0) {
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
  const getEducationDetails = async () => {

    const result: any = await fetch(state.globals.routes.educations + "/" + id)
    const resData = await result.json();
    
    client_id_ChangeHandler(JSON.stringify({ id: resData.client.id.toString(), title: resData.client.name }), "setValue");
    location_id_ChangeHandler(JSON.stringify({ id: resData.location.id.toString(), title: resData.location.name }), "setValue");
    amountChangeHandler(resData.amount, "setValue");
    subject_id_ChangeHandler(JSON.stringify({ id: resData.subject.id.toString(), title: resData.subject.name }), "setValue");
    status_id_ChangeHandler(JSON.stringify({ id: resData.status.id.toString(), title: resData.status.name }), "setValue");
    descriptionChangeHandler(resData.description, "setValue");

    setIsDetailsFetched(true);
    setShowSpinner(false);
  }

  const {
    value: client_id_Value,
    isValid: client_id_IsValid,
    isTouched: client_id_IsTouched,
    validReason: client_id_ValidReason,
    hasError: client_id_HasError,
    valueChangeHandler: client_id_ChangeHandler,
    inputBlurHandler: client_id_BlurHandler,
    reset: reset_client_id,
  } = useInput(["required"]);
  const {
    value: location_id_Value,
    isValid: location_id_IsValid,
    isTouched: location_id_IsTouched,
    validReason: location_id_ValidReason,
    hasError: location_id_HasError,
    valueChangeHandler: location_id_ChangeHandler,
    inputBlurHandler: location_id_BlurHandler,
    reset: reset_location_id,
  } = useInput([]);
  const {
    value: amountValue,
    isValid: amountIsValid,
    isTouched: amountIsTouched,
    validReason: amountValidReason,
    hasError: amountHasError,
    valueChangeHandler: amountChangeHandler,
    inputBlurHandler: amountBlurHandler,
    reset: resetAmount,
  } = useInput(["required"]);
  const {
    value: subject_id_Value,
    isValid: subject_id_IsValid,
    isTouched: subject_id_IsTouched,
    validReason: subject_id_ValidReason,
    hasError: subject_id_HasError,
    valueChangeHandler: subject_id_ChangeHandler,
    inputBlurHandler: subject_id_BlurHandler,
    reset: reset_subject_id,
  } = useInput(["required"]);
  const {
    value: status_id_Value,
    isValid: status_id_IsValid,
    isTouched: status_id_IsTouched,
    validReason: status_id_ValidReason,
    hasError: status_id_HasError,
    valueChangeHandler: status_id_ChangeHandler,
    inputBlurHandler: status_id_BlurHandler,
    reset: reset_status_id,
  } = useInput(["required"]);
  const {
    value: descriptionValue,
    isValid: descriptionIsValid,
    isTouched: descriptionIsTouched,
    validReason: descriptionValidReason,
    hasError: descriptionHasError,
    valueChangeHandler: descriptionChangeHandler,
    inputBlurHandler: descriptionBlurHandler,
    reset: resetDescription,
  } = useInput(["required"]);

  let formIsValid = false;

  if (client_id_IsValid && amountIsValid && subject_id_IsValid && status_id_IsValid && descriptionIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }

    setIsLoading(true);

    let url = props.mode === "edit" ? ("/" + id) : "";
    let requestBody = {
      client_id: JSON.parse(client_id_Value).id,
      location_id: location_id_Value !== "" ? JSON.parse(location_id_Value).id : "",
      amount: amountValue,
      subject_id: JSON.parse(subject_id_Value).id,
      status_id: JSON.parse(status_id_Value).id,
      description: descriptionValue
    };

    const result: any = await fetch(state.globals.routes.educations + url, {
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
      navigate(state.globals.urls.educations);
    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }
  };

  useEffect(() => {
    getClients();

  }, [clientSearchInputValue]);

  const getClients = async () => {

    let fetchUrl = state.globals.routes.clients + "?name=" + clientSearchInputValue + "&sort=created_at";

    const result: any = await fetch(fetchUrl)
    const resData: any = await result.json();

    if (result.ok) {
      let clients: any[] = [];
      resData.data.map((item: any) => (
        clients.push({
          id: item.id,
          title: item.name,
        })
      ));
      setClientOptions(clients);
      setLocationSearchInputValue("");
    }
    else {
      setClientOptions([]);
      setErrorMessage(resData.message);
      setShowError(true);
    }
  }

  useEffect(() => {
    getLocations();

  }, [locationSearchInputValue, client_id_Value]);

  const getLocations = async () => {
    if (client_id_Value !== "") {
      let fetchUrl = state.globals.routes.location + "?client_id=" + JSON.parse(client_id_Value).id + "&sort=created_at";

      const result: any = await fetch(fetchUrl)
      const resData: any = await result.json();

      if (result.ok) {
        let locations: any[] = [];
        resData.data.map((item: any) => (
          locations.push({
            id: item.id,
            title: item.name,
          })
        ));

        setLocationOptions(locations);
      }
      else {
        setLocationOptions([]);
        setErrorMessage(resData.message);
        setShowError(true);
      }
    }
    else {
      setLocationOptions([]);
    }
  }

  const createClientCallback = (option: string) => {
    client_id_ChangeHandler(option, "setValue");
    setAddclientDialogModal(false);
  }
  const createLocationCallback = (option: string) => {
    location_id_ChangeHandler(option, "setValue");
    setAddLocationDialogModal(false);
  }
  if (!showSpinner) {
    return (
      <>
        <FormDialog
          title={"Müşteri Ekle"}
          show={addclientDialogModal}
          handleCloseFormDialog={() => setAddclientDialogModal(false)}>
          <Step1CreateEdit mode="create" isModal={true} callback={createClientCallback} />
        </FormDialog>

        <FormDialog
          title={"Lokasyon Ekle"}
          show={addLocationDialogModal}
          handleCloseFormDialog={() => setAddLocationDialogModal(false)}>
          <Step2Locations mode="create" isModal={true} callback={createLocationCallback} client_id={client_id_Value !== "" ? JSON.parse(client_id_Value).id : ""} />
        </FormDialog>

        <CardContent>

          <Box component="form" noValidate sx={{ mt: 1, display: "flex", flexWrap: "wrap" }}>
            <Grid xs={6}>
              <Grid xs={9}
                style={{ marginBottom: "15px" }}
              >
                <Grid xs={12} sx={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <InputLabel>Müşteri Seç</InputLabel>
                  <Button variant="text" size="small" onClick={() => setAddclientDialogModal(true)}>
                    MÜŞTERİ EKLE
                  </Button>
                </Grid>
                <Autocomplete
                  value={client_id_Value !== "" ? JSON.parse(client_id_Value) : null}
                  onChange={(event: any, newValue: any) => {
                    client_id_ChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
                  }}
                  onInputChange={(event, newInputValue) => {
                    setClientSearchInputValue(newInputValue);
                  }}
                  id="clients-select"
                  options={clientOptions}
                  getOptionLabel={(option) => option.title}
                  renderOption={(props, option) => <li {...props}>{option.title}</li>}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                      }}
                    />
                  )}
                  className={(isFormSubmitted && client_id_HasError) ? "has-error" : ""}
                  disabled={props.mode === "view"}

                />
                {isFormSubmitted && client_id_HasError && <div><FormHelperText error={true}>{client_id_ValidReason}</FormHelperText></div>}

              </Grid>
              <Grid xs={9}
                style={{ marginBottom: "15px" }}
              >
                <Grid xs={12} sx={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <InputLabel>Lokasyon Seç</InputLabel>
                  {
                    client_id_Value !== "" &&
                    <Button variant="text" size="small" onClick={() => setAddLocationDialogModal(true)}>
                      LOKASYON EKLE
                    </Button>
                  }

                </Grid>
                <Autocomplete
                  value={location_id_Value !== "" ? JSON.parse(location_id_Value) : null}
                  onChange={(event: any, newValue: any) => {
                    location_id_ChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
                  }}
                  onInputChange={(event, newInputValue) => {
                    setLocationSearchInputValue(newInputValue);
                  }}
                  id="location-select"
                  options={locationOptions}
                  getOptionLabel={(option) => option.title}
                  renderOption={(props, option) => <li {...props}>{option.title}</li>}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'off',
                         
                      }}
                    />
                  )}
                  className={(isFormSubmitted && location_id_HasError) ? "has-error" : ""}
                  disabled={props.mode === "view" || client_id_Value === ""}

                />
                {isFormSubmitted && location_id_HasError && <div><FormHelperText error={true}>{location_id_ValidReason}</FormHelperText></div>}

              </Grid>

            </Grid>

            <Grid xs={6}>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>Eğitim Konusu</InputLabel>
                <Autocomplete
                  value={subject_id_Value !== "" ? JSON.parse(subject_id_Value) : null}
                  onChange={(event: any, newValue: any) => {
                    subject_id_ChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
                  }}
                  id="education-subject-select"
                  options={state.globals.formDatas.seminarSubjectOptions}
                  getOptionLabel={(option) => option.title}
                  renderOption={(props, option) => <li {...props}>{option.title}</li>}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                      }}
                    />
                  )}
                  className={(isFormSubmitted && subject_id_HasError) ? "has-error" : ""}
                  disabled={props.mode === "view"}

                />
                {isFormSubmitted && subject_id_HasError && <div><FormHelperText error={true}>{subject_id_ValidReason}</FormHelperText></div>}

              </Grid>

              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>
                  Tutar
                </InputLabel>

                <DecimalMask
                  max={999999}
                  decimalValue={amountValue}
                  decimalChangeHandler={(maskedData: any) => amountChangeHandler(maskedData, "mask")}
                  decimalBlurHandler={amountBlurHandler}
                  isFormSubmitted={isFormSubmitted}
                  disabled={props.mode === "view"}
                  decimalHasError={amountHasError} />

                {isFormSubmitted && amountHasError && <div><FormHelperText error={true}>{amountValidReason}</FormHelperText></div>}

              </Grid>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>Durum</InputLabel>
                <Autocomplete
                  value={status_id_Value !== "" ? JSON.parse(status_id_Value) : null}
                  onChange={(event: any, newValue: any) => {
                    status_id_ChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
                  }}
                  id="status-select"
                  options={state.globals.formDatas.seminarStatusOptions}
                  getOptionLabel={(option) => option.title}
                  renderOption={(props, option) => <li {...props}>{option.title}</li>}
                  sx={{ width: "100%" }}
                  renderInput={(params) => (
                    <TextField {...params}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: 'new-password',
                      }}
                    />
                  )}
                  className={(isFormSubmitted && status_id_HasError) ? "has-error" : ""}
                  disabled={props.mode === "view"}

                />
                {isFormSubmitted && status_id_HasError && <div><FormHelperText error={true}>{status_id_ValidReason}</FormHelperText></div>}

              </Grid>
            </Grid>
            <Grid xs={10}
              style={{ marginBottom: "15px" }}
            >
              <InputLabel>
                Açıklama
              </InputLabel>
              <TextField
                fullWidth
                id="desc"
                name="desc"
                autoComplete="new-password"
                multiline
                rows={6}
                value={descriptionValue}
                onChange={descriptionChangeHandler}
                onBlur={descriptionBlurHandler}
                className={(isFormSubmitted && descriptionHasError) ? "has-error" : ""}
                disabled={props.mode === "view"}
              />
              {isFormSubmitted && descriptionHasError && <div><FormHelperText error={true}>{descriptionValidReason}</FormHelperText></div>}

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
      <Box sx={{ display: 'flex', justifyContent: 'center',padding:5 }}>
        <CircularProgress />
      </Box>
    );
  }
};

export default CreateEditForm;
