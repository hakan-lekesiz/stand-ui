import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import useInput from '../../store/use-input';
import spinner from '../../components/Content/Images/circles-light.svg';
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, CardContent, InputLabel, Divider, TextField, Grid, Snackbar, FormHelperText, CircularProgress, MenuItem } from '@mui/material';

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { IOption } from "../../models/Misc";

const filter = createFilterOptions<IOption>();

const CreateEditForm = (props: any) => {
  const navigate = useNavigate();
  const [state, dispatch] = useStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  let { id } = useParams<"id">();

  useEffect(() => {

    if (id && (props.mode === "edit" || props.mode === "view")) {
      getProcedureDetails();
    }
  }, []);

  useEffect(() => {

    if (state.globals.formDatas.accreditationOption.length > 0 && state.globals.formDatas.standartOption.length > 0) {
      setShowSpinner(false);
    }
    else {
      setTimeout(() => {
        dispatch('SET_UPDATE');
      }, 1000);
    }
  }, [state]);
 
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
    value: accreditation_id_Value,
    isValid: accreditation_id_IsValid,
    isTouched: accreditation_id_IsTouched,
    validReason: accreditation_id_ValidReason,
    hasError: accreditation_id_HasError,
    valueChangeHandler: accreditation_id_ChangeHandler,
    inputBlurHandler: accreditation_id_BlurHandler,
    reset: reset_accreditation_id,
  } = useInput(["required"]);

  const {
    value: standard_id_Value,
    isValid: standard_id_IsValid,
    isTouched: standard_id_IsTouched,
    validReason: standard_id_ValidReason,
    hasError: standard_id_HasError,
    valueChangeHandler: standard_id_ChangeHandler,
    inputBlurHandler: standard_id_BlurHandler,
    reset: reset_standard_id,
  } = useInput(["required"]);

  let formIsValid = false;

  if (nameIsValid && accreditation_id_IsValid && standard_id_IsValid) {
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
      standard_id: JSON.parse(standard_id_Value).id,
      accreditation_id: JSON.parse(accreditation_id_Value).id,
      name: nameValue,
    };

    const result: any = await fetch(state.globals.routes.procedures + url, {
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
      navigate(state.globals.urls.procedures);
    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }
  };
  const handleAccreditationChange = async (event: any, newValue: any) => {

    //yeni value eklenmek isteniyorsa
    if (newValue && newValue.title.includes("Ekle ")) {
      let requestBody = {
        name: newValue.inputValue
      }

      const result: any = await fetch(state.globals.routes.accreditationOption, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        },
      })

      const resData = await result.json();

      if (result.ok) {
        dispatch('GET_ACCREDITATIONS');
        accreditation_id_ChangeHandler(JSON.stringify({ title: resData.name, id: resData.id.toString() }), "setValue");
      }
      else {
        accreditation_id_ChangeHandler("", "setValue");
        setErrorMessage(resData.message);
        setShowError(true);
      }
    }
    else {
      accreditation_id_ChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
    }

  }
  const handleStandartChange = async (event: any, newValue: any) => {

    //yeni value eklenmek isteniyorsa
    if (newValue && newValue.title.includes("Ekle ")) {
      let requestBody = {
        name: newValue.inputValue
      }

      const result: any = await fetch(state.globals.routes.standartOption, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        },
      })

      const resData = await result.json();

      if (result.ok) {
        dispatch('GET_STANDARTS');
        standard_id_ChangeHandler(JSON.stringify({ title: resData.name, id: resData.id.toString() }), "setValue");
      }
      else {
        standard_id_ChangeHandler("", "setValue");
        setErrorMessage(resData.message);
        setShowError(true);
      }
    }
    else {
      standard_id_ChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
    }

  }

  const getProcedureDetails = async () => {

    const result: any = await fetch(state.globals.routes.procedures + "/" + id)
    const resData = await result.json();

    accreditation_id_ChangeHandler(JSON.stringify({ id: resData.accreditation.id.toString(), title: resData.accreditation.name }), "setValue");
    standard_id_ChangeHandler(JSON.stringify({ id: resData.standard.id.toString(), title: resData.standard.name }), "setValue");
    nameChangeHandler(resData.name, "setValue");

  }

  if (!showSpinner) {
    return (
      <>
        <CardContent>

          <Box component="form" noValidate sx={{ mt: 1, display: "flex", flexWrap: "wrap" }}>
            <Grid xs={6}>

              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>Akretidasyon</InputLabel>
                {
                  state.globals.formDatas.accreditationOption.length > 0 &&
                  <Autocomplete
                    value={accreditation_id_Value !== "" ? JSON.parse(accreditation_id_Value) : null}
                    onChange={handleAccreditationChange}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some((option) => inputValue === option.title);
                      if (inputValue !== '' && !isExisting) {

                        filtered.push({
                          inputValue,
                          title: `Ekle "${inputValue}"`,
                        });

                      }

                      return filtered;

                    }}
                    options={state.globals.formDatas.accreditationOption}
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
                    className={(isFormSubmitted && accreditation_id_HasError) ? "has-error" : ""}
                    disabled={props.mode === "view"}

                  />
                }
                {isFormSubmitted && accreditation_id_HasError && <div><FormHelperText error={true}>{accreditation_id_ValidReason}</FormHelperText></div>}
              </Grid>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>Standart</InputLabel>
                {
                  state.globals.formDatas.standartOption.length > 0 &&
                  <Autocomplete
                    value={standard_id_Value !== "" ? JSON.parse(standard_id_Value) : null}
                    onChange={handleStandartChange}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some((option) => inputValue === option.title);
                      if (inputValue !== '' && !isExisting) {

                        filtered.push({
                          inputValue,
                          title: `Ekle "${inputValue}"`,
                        });

                      }

                      return filtered;

                    }}
                    options={state.globals.formDatas.standartOption}
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
                    className={(isFormSubmitted && standard_id_HasError) ? "has-error" : ""}
                    disabled={props.mode === "view"}

                  />
                }
                {isFormSubmitted && standard_id_HasError && <div><FormHelperText error={true}>{standard_id_ValidReason}</FormHelperText></div>}
              </Grid>
              <Grid xs={8}
                style={{ marginBottom: "15px" }}
              >
                <InputLabel>
                  Prosedür İsmi ( İlk Belgelendirme )
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
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
};

export default CreateEditForm;
