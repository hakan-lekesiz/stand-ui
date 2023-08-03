import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import { ICurrentPage } from '../../models/ICurrentPage';
import useInput from '../../store/use-input';
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Container, Breadcrumbs, Typography, Link, Card, Snackbar, CardContent, Grid, FormControl, RadioGroup, FormControlLabel, Radio, InputLabel,
  TextField, FormHelperText, MenuItem, Select, Button, Divider, CircularProgress
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {
  Step1ClientInfo,
} from "../../models/Clients";
import { PhoneMask, TaxNoMask, TcNoMask } from "../../components/Inputs/Masks";

import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { IOption } from "../../models/Misc";
import Revisions from "../../components/Revisions/Revisions";

const filter = createFilterOptions<IOption>();

const Step1CreateEdit = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  let { id } = useParams<"id">();

  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [tabberValue] = useState('1');
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [isDetailsFetched, setIsDetailsFetched] = useState<boolean>(false);

  useEffect(() => {
    if (!props.isModal) {


      var pTitle = "Müşteri Ekle";
      if (props.mode === "edit") {
        pTitle = "Müşteri Düzenle";
      }
      else if (props.mode === "view") {
        pTitle = "Müşteri Detayları";
      }

      setTitle(pTitle);

      const currentPage: ICurrentPage = {
        name: pTitle
      };
      dispatch('SET_CURRENT_PAGE', currentPage);

    }

    if (id && (props.mode === "edit" || props.mode === "view")) {
      getClientDetails();
    }
    else {
      isCommercialChangeHandler("personal", "setValue");
    }
  }, []);

  useEffect(() => {

    if (state.globals.formDatas.consultantOptions.length > 0) {
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

  const getClientDetails = async () => {

    const result: any = await fetch(state.globals.routes.clients + "/" + id)
    const resData = await result.json();

    nameChangeHandler(resData.name, "setValue");
    emailChangeHandler(resData.email, "setValue");
    phoneChangeHandler(resData.phone, "setValue");
    if (resData.tc_id) {
      tcNoChangeHandler(resData.tc_id, "setValue");
    }
    isCommercialChangeHandler(resData.is_commercial === 1 ? "commercial" : "personal", "setValue");
    consultantChangeHandler(JSON.stringify({ id: resData.consultant.id.toString(), title: resData.consultant.name }), "setValue");
    if (resData.authorized_person) {
      authorized_person_ChangeHandler(resData.authorized_person, "setValue");
    }
    if (resData.contact_person) {
      contact_person_ChangeHandler(resData.contact_person, "setValue");
    }
    if (resData.website) {
      website_ChangeHandler(resData.website, "setValue");
    }
    if (resData.tax_id) {
      taxNoChangeHandler(resData.tax_id, "setValue");
    }
    if (resData.tax_office) {
      taxOfficeChangeHandler(resData.tax_office, "setValue");
    }

    setIsDetailsFetched(true);
    setShowSpinner(false);
  }

  const handleTabberChange = (event: any, newValue: string) => {

    if (newValue === "2") {
      navigate(state.globals.urls.clientLocations.replace(":id", id));
    }
    else if (newValue === "3") {
      navigate(state.globals.urls.clientFolders.replace(":id", id));
    }
    else if (newValue === "4") {
      navigate(state.globals.urls.clientNotes.replace(":id", id));
    }
  };

  let isAuth = props.mode === "create" && authCtx.user.scopes.includes("client.create");
  isAuth = isAuth || props.mode === "edit" && authCtx.user.scopes.includes("client.update");
  isAuth = isAuth || props.mode === "view" && authCtx.user.scopes.includes("client.viewAny");

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => navigate(state.globals.urls.clients)}>
      Müşteriler
    </Link>,
    <Typography key="3" color="text.primary">
      {title}
    </Typography>
  ];

  const {
    value: commercialValue,
    isValid: isCommercialIsValid,
    isTouched: isCommercialIsTouched,
    validReason: isCommercialValidReason,
    hasError: isCommercialHasError,
    valueChangeHandler: isCommercialChangeHandler,
    inputBlurHandler: isCommercialBlurHandler,
    reset: resetIsCommercial,
  } = useInput(["required"]);

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
    value: tcNoValue,
    isValid: tcNoIsValid,
    isTouched: tcNoIsTouched,
    validReason: tcNoValidReason,
    hasError: tcNoHasError,
    valueChangeHandler: tcNoChangeHandler,
    inputBlurHandler: tcNoBlurHandler,
    reset: resetTcNo,
  } = useInput(["required", "citizenid"]);

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
    value: consultantValue,
    isValid: consultantIsValid,
    isTouched: consultantIsTouched,
    validReason: consultantValidReason,
    hasError: consultantHasError,
    valueChangeHandler: consultantChangeHandler,
    inputBlurHandler: consultantBlurHandler,
    reset: resetConsultant,
  } = useInput([]);

  const {
    value: authorized_person_Value,
    isValid: authorized_person_IsValid,
    isTouched: authorized_person_IsTouched,
    validReason: authorized_person_ValidReason,
    hasError: authorized_person_HasError,
    valueChangeHandler: authorized_person_ChangeHandler,
    inputBlurHandler: authorized_person_BlurHandler,
    reset: reset_authorized_person,
  } = useInput([]);

  const {
    value: contact_person_Value,
    isValid: contact_person_IsValid,
    isTouched: contact_person_IsTouched,
    validReason: contact_person_ValidReason,
    hasError: contact_person_HasError,
    valueChangeHandler: contact_person_ChangeHandler,
    inputBlurHandler: contact_person_BlurHandler,
    reset: reset_contact_person,
  } = useInput([]);

  const {
    value: website_Value,
    isValid: website_IsValid,
    isTouched: website_IsTouched,
    validReason: website_ValidReason,
    hasError: website_HasError,
    valueChangeHandler: website_ChangeHandler,
    inputBlurHandler: website_BlurHandler,
    reset: reset_website,
  } = useInput(["required", "url"]);

  const {
    value: taxNoValue,
    isValid: taxNoIsValid,
    isTouched: taxNoIsTouched,
    validReason: taxNoValidReason,
    hasError: taxNoHasError,
    valueChangeHandler: taxNoChangeHandler,
    inputBlurHandler: taxNoBlurHandler,
    reset: resetTaxNo,
  } = useInput(["required", "exact:10"]);

  const {
    value: taxOfficeValue,
    isValid: taxOfficeIsValid,
    isTouched: taxOfficeIsTouched,
    validReason: taxOfficeValidReason,
    hasError: taxOfficeHasError,
    valueChangeHandler: taxOfficeChangeHandler,
    inputBlurHandler: taxOfficeBlurHandler,
    reset: resetTaxOffice,
  } = useInput(["required"]);


  let formIsValid = false;

  if (emailIsValid && nameIsValid && phoneIsValid && isCommercialIsValid && consultantIsValid) {
    if (commercialValue === "commercial") {
      if (authorized_person_IsValid && contact_person_IsValid && website_IsValid && taxNoIsValid && taxOfficeIsValid) {
        formIsValid = true;
      }
    }
    else {
      if (tcNoIsValid) {
        formIsValid = true;
      }
    }
  }

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }

    let step1ClientInfo: Step1ClientInfo = {}

    if (commercialValue === "commercial") {
      step1ClientInfo = {
        is_commercial: commercialValue === "commercial",
        name: nameValue,
        tax_office: taxOfficeValue,
        tax_id: taxNoValue,
        email: emailValue,
        phone: phoneValue,
        website: website_Value,
        authorized_person: authorized_person_Value,
        contact_person: contact_person_Value,
        consultant_id: consultantValue ? JSON.parse(consultantValue).id : ""
      };
    }
    else {
      step1ClientInfo = {
        is_commercial: commercialValue === "commercial",
        name: nameValue,
        tc_id: tcNoValue,
        email: emailValue,
        phone: phoneValue,
        consultant_id: consultantValue ? JSON.parse(consultantValue).id : ""
      };
    }

    let url = props.mode === "edit" ? ("/" + id) : "";
    const result: any = await fetch(state.globals.routes.clients + url, {
      method: props.mode === "edit" ? 'PUT' : 'POST',
      body: JSON.stringify(step1ClientInfo),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
    })

    const resData = await result.json();

    if (result.ok) {
      if (props.isModal) {
        props.callback(JSON.stringify({ id: resData.id, title: resData.name }));
      }
      else {
        navigate(state.globals.urls.clientLocations.replace(":id", resData.id));
      }
    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }
  };

  const handleConsultantChange = async (event: any, newValue: any) => {

    //yeni value eklenmek isteniyorsa
    if (newValue && newValue.title.includes("Ekle ")) {
      let requestBody = {
        name: newValue.inputValue
      }

      const result: any = await fetch(state.globals.routes.consultantOptions, {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'content-type': 'application/json',
          'accept': 'application/json'
        },
      })

      const resData = await result.json();

      if (result.ok) {
        dispatch('GET_CONSULTANT');
        consultantChangeHandler(JSON.stringify({ title: resData.name, id: resData.id.toString() }), "setValue");
      }
      else {
        consultantChangeHandler("", "setValue");
        setErrorMessage(resData.message);
        setShowError(true);
      }
    }
    else {
      consultantChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
    }

  }

  if (!isAuth) {
    return (
      <div>
        <Breadcrumbs separator="-" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
        <div>
          Bu sayfaya giriş izniniz yok.
        </div>
      </div>
    );
  }
  else {
    if (!showSpinner) {
      return (
        <>
          {
            !props.isModal &&
            <Breadcrumbs separator="-" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          }



          <Box
            component="main"
            sx={{
              flexGrow: 1,
              py: 8
            }}
          >

            <Card>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabberValue}>
                  {
                    !props.isModal &&
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>

                      <TabList onChange={handleTabberChange} aria-label="lab API tabs example">
                        <Tab label={props.mode === "edit" ? "Müşteri Düzenle" : "Müşteri Ekle"} value="1" />
                        <Tab label="Lokasyon" value="2" disabled={props.mode === "edit" || props.mode === "view" ? false : true} />
                        <Tab label="Dosyalar" value="3" disabled={props.mode === "edit" || props.mode === "view" ? false : true} />
                        <Tab label="Notlar" value="4" disabled={props.mode === "edit" || props.mode === "view" ? false : true} />
                      </TabList>
                    </Box>
                  }
                  <TabPanel value="1">
                    <CardContent>

                      <Box component="form" noValidate sx={{ display: "flex", flexWrap: "wrap" }}>
                        <Grid xs={12} mb={3}>
                          <FormControl component="fieldset">
                            <RadioGroup row aria-label="gender" name="row-radio-buttons-group"
                              value={commercialValue}
                              onChange={(event: any) => isCommercialChangeHandler(event.target.value, "setValue")}>

                              <FormControlLabel value="commercial" control={<Radio disabled={props.mode === "view"} />} label="Kurumsal" />
                              <FormControlLabel value="personal" control={<Radio disabled={props.mode === "view"} />} label="Bireysel" />
                            </RadioGroup>
                          </FormControl>
                        </Grid>

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
                          {
                            commercialValue === "personal" &&
                            <Grid xs={8}
                              style={{ marginBottom: "15px" }}
                            >
                              <InputLabel>
                                TC No
                              </InputLabel>
                              <TcNoMask
                                tcNoValue={tcNoValue}
                                tcNoChangeHandler={(maskedData: any) => tcNoChangeHandler(maskedData, "mask")}
                                tcNoBlurHandler={tcNoBlurHandler}
                                isFormSubmitted={isFormSubmitted}
                                disabled={props.mode === "view"}
                                tcNoHasError={tcNoHasError} />
                              {isFormSubmitted && tcNoHasError && <div><FormHelperText error={true}>{tcNoValidReason}</FormHelperText></div>}


                            </Grid>
                          }
                          {
                            commercialValue === "commercial" &&
                            <>
                              <Grid xs={8}
                                style={{ marginBottom: "15px" }}
                              >
                                <InputLabel>
                                  Vergi Dairesi
                                </InputLabel>
                                <TextField
                                  fullWidth
                                  id="taxOffice"
                                  name="taxOffice"
                                  autoComplete="taxOffice"
                                  value={taxOfficeValue}
                                  onChange={taxOfficeChangeHandler}
                                  onBlur={taxOfficeBlurHandler}
                                  className={(isFormSubmitted && taxOfficeHasError) ? "has-error" : ""}
                                  disabled={props.mode === "view"}
                                />
                                {isFormSubmitted && taxOfficeHasError && <div><FormHelperText error={true}>{taxOfficeValidReason}</FormHelperText></div>}

                              </Grid>

                              <Grid xs={8}
                                style={{ marginBottom: "15px" }}
                              >
                                <InputLabel>
                                  Vergi No
                                </InputLabel>
                                <TaxNoMask
                                  taxNoValue={taxNoValue}
                                  taxNoChangeHandler={(maskedData: any) => taxNoChangeHandler(maskedData, "mask")}
                                  taxNoBlurHandler={taxNoBlurHandler}
                                  isFormSubmitted={isFormSubmitted}
                                  disabled={props.mode === "view"}
                                  taxNoHasError={taxNoHasError} />
                                {isFormSubmitted && taxNoHasError && <div><FormHelperText error={true}>{taxNoValidReason}</FormHelperText></div>}

                              </Grid>
                            </>

                          }
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

                            <InputLabel>Danışman</InputLabel>
                            <Autocomplete
                              value={consultantValue !== "" ? JSON.parse(consultantValue) : null}
                              onChange={handleConsultantChange}
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
                              id="free-solo-with-text-demo"
                              options={state.globals.formDatas.consultantOptions}
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
                              className={(isFormSubmitted && consultantHasError) ? "has-error" : ""}
                              disabled={props.mode === "view"}

                            />
                            {isFormSubmitted && consultantHasError && <div><FormHelperText error={true}>{consultantValidReason}</FormHelperText></div>}

                          </Grid>

                          {
                            commercialValue === "commercial" &&
                            <>

                              <Grid xs={8}
                                style={{ marginBottom: "15px" }}
                              >
                                <InputLabel>
                                  Yetkili Kişi
                                </InputLabel>
                                <TextField
                                  fullWidth
                                  id="authorized_person"
                                  name="authorized_person"
                                  autoComplete="authorized_person"
                                  value={authorized_person_Value}
                                  onChange={authorized_person_ChangeHandler}
                                  onBlur={authorized_person_BlurHandler}
                                  className={(isFormSubmitted && authorized_person_HasError) ? "has-error" : ""}
                                  disabled={props.mode === "view"}
                                />
                                {isFormSubmitted && authorized_person_HasError && <div><FormHelperText error={true}>{authorized_person_ValidReason}</FormHelperText></div>}

                              </Grid>

                              <Grid xs={8}
                                style={{ marginBottom: "15px" }}
                              >
                                <InputLabel>
                                  İrtibat Kişisi / YT
                                </InputLabel>
                                <TextField
                                  fullWidth
                                  id="contact_person"
                                  name="contact_person"
                                  autoComplete="contact_person"
                                  value={contact_person_Value}
                                  onChange={contact_person_ChangeHandler}
                                  onBlur={contact_person_BlurHandler}
                                  className={(isFormSubmitted && contact_person_HasError) ? "has-error" : ""}
                                  disabled={props.mode === "view"}
                                />
                                {isFormSubmitted && contact_person_HasError && <div><FormHelperText error={true}>{contact_person_ValidReason}</FormHelperText></div>}

                              </Grid>

                              <Grid xs={8}
                                style={{ marginBottom: "15px" }}
                              >
                                <InputLabel>
                                  Web Adresi
                                </InputLabel>
                                <TextField
                                  fullWidth
                                  id="website"
                                  name="website"
                                  autoComplete="website"
                                  value={website_Value}
                                  onChange={website_ChangeHandler}
                                  onBlur={website_BlurHandler}
                                  className={(isFormSubmitted && website_HasError) ? "has-error" : ""}
                                  disabled={props.mode === "view"}
                                />
                                {isFormSubmitted && website_HasError && <div><FormHelperText error={true}>{website_ValidReason}</FormHelperText></div>}

                              </Grid>
                            </>
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
                            props.mode === "edit" &&
                            "KAYDET"
                          }
                          {
                            props.mode === "create" &&
                            "EKLE"
                          }
                        </Button>
                      }
                    </Box>
                  </TabPanel>
                  <TabPanel value="2"></TabPanel>
                  <TabPanel value="3"></TabPanel>
                  <TabPanel value="4"></TabPanel>
                </TabContext>
              </Box>
            </Card>

            {
              authCtx.user.scopes.includes("revision.view") && !props.isModal && props.mode !== "create" &&
              <Revisions model="client" id={id} />
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

  }
};

export default Step1CreateEdit;
