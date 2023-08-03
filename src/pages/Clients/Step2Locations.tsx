import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import { ICurrentPage } from '../../models/ICurrentPage';
import useInput from '../../store/use-input';
import { useParams, useNavigate } from "react-router-dom";
import {
  Box, Container, Breadcrumbs, Typography, Link, Card, Snackbar, CardContent, Grid, FormControl, RadioGroup, FormControlLabel, Radio, InputLabel,
  TextField, FormHelperText, MenuItem, Select, Button, Divider,CircularProgress
} from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { PhoneMask } from "../../components/Inputs/Masks";

import Autocomplete from '@mui/material/Autocomplete';
import { ILocation } from "../../models/Locations";
import Step2LocationList from "./Step2LocationList";
import Revisions from "../../components/Revisions/Revisions";


const Step2Locations = (props: any) => {
  const navigate = useNavigate();
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  let { id } = useParams<"id">();

  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [locationListRefresher, setLocationListRefresher] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mode, setMode] = useState<string>("create");
  const [editedLocationId, setEditedLocationId] = useState<number>(0);
  const [showSpinner, setShowSpinner] = useState<boolean>(true);

  const [districts, setDistricts] = useState<any[]>([]);
  const [tabberValue] = useState('2');

  useEffect(() => {
    if (!props.isModal) {

      const currentPage: ICurrentPage = {
        name: "Lokasyon"
      };
      dispatch('SET_CURRENT_PAGE', currentPage);
    }



  }, []);

  useEffect(() => {
    
    if (state.globals.formDatas.locationTypes.length > 0 && state.globals.formDatas.cities.length > 0) {
      setShowSpinner(false);
    }
    else{
      setTimeout(() => {
        dispatch('SET_UPDATE');
      }, 1000);
    }
  }, [state]);

  const handleTabberChange = (event: any, newValue: string) => {

    if (newValue === "1") {
      if (authCtx.user.scopes.includes("client.update")) {
        navigate(state.globals.urls.clientEdit.replace(":id", id));
      }
      else {
        navigate(state.globals.urls.clientView.replace(":id", id));
      }
    }
    else if (newValue === "3") {
      navigate(state.globals.urls.clientFolders.replace(":id", id));
    }
    else if (newValue === "4") {
      navigate(state.globals.urls.clientNotes.replace(":id", id));
    }
  };

  let isAuth = authCtx.user.scopes.includes("client.viewAny") || authCtx.user.scopes.includes("client.update");

  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="#" onClick={() => navigate(state.globals.urls.clients)}>
      Müşteriler
    </Link>,
    <Typography key="3" color="text.primary">
      Lokasyon
    </Typography>
  ];

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
    value: location_definition_id_Value,
    isValid: location_definition_id_IsValid,
    isTouched: location_definition_id_IsTouched,
    validReason: location_definition_id_ValidReason,
    hasError: location_definition_id_HasError,
    valueChangeHandler: location_definition_id_ChangeHandler,
    inputBlurHandler: location_definition_id_BlurHandler,
    reset: reset_location_definition_id,
  } = useInput(["required"]);

  const {
    value: city_id_Value,
    isValid: city_id_IsValid,
    isTouched: city_id_IsTouched,
    validReason: city_id_ValidReason,
    hasError: city_id_HasError,
    valueChangeHandler: city_id_ChangeHandler,
    inputBlurHandler: city_id_BlurHandler,
    reset: reset_city_id,
  } = useInput(["required"]);

  const {
    value: district_id_Value,
    isValid: district_id_IsValid,
    isTouched: district_id_IsTouched,
    validReason: district_id_ValidReason,
    hasError: district_id_HasError,
    valueChangeHandler: district_id_ChangeHandler,
    inputBlurHandler: district_id_BlurHandler,
    reset: reset_district_id,
  } = useInput(["required"]);

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
    value: addressValue,
    isValid: addressIsValid,
    isTouched: addressIsTouched,
    validReason: addressValidReason,
    hasError: addressHasError,
    valueChangeHandler: addressChangeHandler,
    inputBlurHandler: addressBlurHandler,
    reset: resetAddress,
  } = useInput(["required"]);

  const {
    value: employee_count_Value,
    isValid: employee_count_IsValid,
    isTouched: employee_count_IsTouched,
    validReason: employee_count_ValidReason,
    hasError: employee_count_HasError,
    valueChangeHandler: employee_count_ChangeHandler,
    inputBlurHandler: employee_count_BlurHandler,
    reset: reset_employee_count,
  } = useInput(["required"]);

  const {
    value: branch_agent_Value,
    isValid: branch_agent_IsValid,
    isTouched: branch_agent_IsTouched,
    validReason: branch_agent_ValidReason,
    hasError: branch_agent_HasError,
    valueChangeHandler: branch_agent_ChangeHandler,
    inputBlurHandler: branch_agent_BlurHandler,
    reset: reset_branch_agent,
  } = useInput([]);

  const {
    value: production_employee_count_Value,
    isValid: production_employee_count_IsValid,
    isTouched: production_employee_count_IsTouched,
    validReason: production_employee_count_ValidReason,
    hasError: production_employee_count_HasError,
    valueChangeHandler: production_employee_count_ChangeHandler,
    inputBlurHandler: production_employee_count_BlurHandler,
    reset: reset_production_employee_count,
  } = useInput([]);

  const {
    value: double_up_employee_count_Value,
    isValid: double_up_employee_count_IsValid,
    isTouched: double_up_employee_count_IsTouched,
    validReason: double_up_employee_count_ValidReason,
    hasError: double_up_employee_count_HasError,
    valueChangeHandler: double_up_employee_count_ChangeHandler,
    inputBlurHandler: double_up_employee_count_BlurHandler,
    reset: reset_double_up_employee_count,
  } = useInput([]);

  const {
    value: nature_of_business_Value,
    isValid: nature_of_business_IsValid,
    isTouched: nature_of_business_IsTouched,
    validReason: nature_of_business_ValidReason,
    hasError: nature_of_business_HasError,
    valueChangeHandler: nature_of_business_ChangeHandler,
    inputBlurHandler: nature_of_business_BlurHandler,
    reset: reset_nature_of_business,
  } = useInput([]);

  const {
    value: shift_count_Value,
    isValid: shift_count_IsValid,
    isTouched: shift_count_IsTouched,
    validReason: shift_count_ValidReason,
    hasError: shift_count_HasError,
    valueChangeHandler: shift_count_ChangeHandler,
    inputBlurHandler: shift_count_BlurHandler,
    reset: reset_shift_count,
  } = useInput([]);

  const {
    value: shift_employee_count_Value,
    isValid: shift_employee_count_IsValid,
    isTouched: shift_employee_count_IsTouched,
    validReason: shift_employee_count_ValidReason,
    hasError: shift_employee_count_HasError,
    valueChangeHandler: shift_employee_count_ChangeHandler,
    inputBlurHandler: shift_employee_count_BlurHandler,
    reset: reset_shift_employee_count,
  } = useInput([]);

  const {
    value: management_employee_count_Value,
    isValid: management_employee_count_IsValid,
    isTouched: management_employee_count_IsTouched,
    validReason: management_employee_count_ValidReason,
    hasError: management_employee_count_HasError,
    valueChangeHandler: management_employee_count_ChangeHandler,
    inputBlurHandler: management_employee_count_BlurHandler,
    reset: reset_management_employee_count,
  } = useInput([]);

  const {
    value: parttime_employee_count_Value,
    isValid: parttime_employee_count_IsValid,
    isTouched: parttime_employee_count_IsTouched,
    validReason: parttime_employee_count_ValidReason,
    hasError: parttime_employee_count_HasError,
    valueChangeHandler: parttime_employee_count_ChangeHandler,
    inputBlurHandler: parttime_employee_count_BlurHandler,
    reset: reset_parttime_employee_count,
  } = useInput([]);


  useEffect(() => {
    
    district_id_ChangeHandler("", "setValue");
    setDistricts([]);
    getDistricts();

  }, [city_id_Value]);

  let formIsValid = false;

  if (nameIsValid && phoneIsValid && location_definition_id_IsValid && city_id_IsValid && district_id_IsValid && addressIsValid && branch_agent_IsValid &&
    employee_count_IsValid && production_employee_count_IsValid && double_up_employee_count_IsValid && nature_of_business_IsValid &&
    shift_count_IsValid && shift_employee_count_IsValid && management_employee_count_IsValid && parttime_employee_count_IsValid) {
    formIsValid = true;

  }

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }
    let location: ILocation = {
      name: nameValue,
      location_definition_id: location_definition_id_Value,
      city_id: JSON.parse(city_id_Value).id,
      district_id: JSON.parse(district_id_Value).id,
      address: addressValue,
      branch_agent: branch_agent_Value,
      phone_number: phoneValue,
      employee_count: employee_count_Value,
      production_employee_count: production_employee_count_Value,
      double_up_employee_count: double_up_employee_count_Value,
      nature_of_business: nature_of_business_Value,
      shift_count: shift_count_Value,
      shift_employee_count: shift_employee_count_Value,
      management_employee_count: management_employee_count_Value,
      parttime_employee_count: parttime_employee_count_Value,
      client_id: props.isModal ? props.client_id : id
    };
    
    let url = mode === "edit" ? ("/" + editedLocationId) : "";
    const result: any = await fetch(state.globals.routes.location + url, {
      method: mode === "edit" ? 'PUT' : 'POST',
      body: JSON.stringify(location),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
    })

    const resData = await result.json();

    if (result.ok) {
      setMode("create");
      setEditedLocationId(0);
      setFormSubmitted(false);
      resetName();
      reset_location_definition_id();
      reset_city_id();
      reset_district_id();
      resetPhone();
      resetAddress();
      reset_employee_count();
      reset_branch_agent();
      reset_production_employee_count();
      reset_double_up_employee_count();
      reset_nature_of_business();
      reset_shift_count();
      reset_shift_employee_count();
      reset_management_employee_count();
      reset_parttime_employee_count();
      if (props.isModal) {
        
        props.callback(JSON.stringify({ id: resData.id, title: resData.name }));
      }
      else {
        setLocationListRefresher(locationListRefresher + 1);
      }
    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }
  };

  const getDistricts = async () => {

    if (city_id_Value) {
      const result: any = await fetch(state.globals.routes.getDistricts.replace(":id", JSON.parse(city_id_Value).id))
      const resData = await result.json();
      let districtsArray: any[] = [];
      resData.map((item: any) => (
        districtsArray.push({
          id: item.id.toString(),
          title: item.name
        })
      ));
      setDistricts(districtsArray);
    }
    else {
      setDistricts([]);
    }
  }

  const handleEdit = async (locationId: number) => {
    setMode("edit");
    setEditedLocationId(locationId);

    const result: any = await fetch(state.globals.routes.location + "/" + locationId)
    const resData = await result.json();

    nameChangeHandler(resData.name, "setValue");
    location_definition_id_ChangeHandler(resData.location_definition.id.toString(), "setValue");
    city_id_ChangeHandler(JSON.stringify({ id: resData.city.id.toString(), title: resData.city.name }), "setValue");
    district_id_ChangeHandler(JSON.stringify({ id: resData.district.id.toString(), title: resData.district.name }), "setValue");
    if (resData.phone_number) {
      phoneChangeHandler(resData.phone_number, "setValue");
    }
    addressChangeHandler(resData.address, "setValue");
    employee_count_ChangeHandler(resData.employee_count, "setValue");


    if (resData.branch_agent) {
      branch_agent_ChangeHandler(resData.branch_agent, "setValue");
    }
    if (resData.production_employee_count) {
      production_employee_count_ChangeHandler(resData.production_employee_count, "setValue");
    }
    if (resData.double_up_employee_count) {
      double_up_employee_count_ChangeHandler(resData.double_up_employee_count, "setValue");
    }
    if (resData.nature_of_business) {
      nature_of_business_ChangeHandler(resData.nature_of_business, "setValue");
    }
    if (resData.shift_count) {
      shift_count_ChangeHandler(resData.shift_count, "setValue");
    }
    if (resData.shift_employee_count) {
      shift_employee_count_ChangeHandler(resData.shift_employee_count, "setValue");
    }
    if (resData.management_employee_count) {
      management_employee_count_ChangeHandler(resData.management_employee_count, "setValue");
    }
    if (resData.parttime_employee_count) {
      parttime_employee_count_ChangeHandler(resData.parttime_employee_count, "setValue");
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
              py: 2
            }}
          >

            <Card sx={{ mb: 2 }}>
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={tabberValue}>
                  {
                    !props.isModal &&
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleTabberChange} aria-label="lab API tabs example">
                        <Tab label="Müşteri Düzenle" value="1" />
                        <Tab label="Lokasyon" value="2" />
                        <Tab label="Dosyalar" value="3" />
                        <Tab label="Notlar" value="4" />
                      </TabList>
                    </Box>
                  }

                  <TabPanel value="1"></TabPanel>
                  <TabPanel value="2">
                    <CardContent>

                      <Box component="form" noValidate sx={{ display: "flex", flexWrap: "wrap" }}>
                        <Grid xs={4}>
                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Lokasyon Adı
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="name"
                              name="name"
                              autoComplete="new-password"
                              autoFocus
                              value={nameValue}
                              onChange={nameChangeHandler}
                              onBlur={nameBlurHandler}
                              className={(isFormSubmitted && nameHasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && nameHasError && <div><FormHelperText error={true}>{nameValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >

                            <InputLabel>Lokasyon Tanımı</InputLabel>
                            <Select sx={{ width: "100%" }}
                              id="user_type"
                              name="user_type"
                              value={location_definition_id_Value}
                              onChange={location_definition_id_ChangeHandler}
                              onBlur={location_definition_id_BlurHandler}
                              className={(isFormSubmitted && location_definition_id_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            >

                              {
                                state.globals.formDatas.locationTypes.map((item: any) => {

                                  return (
                                    <MenuItem key={"location_types_" + item.id} value={item.id.toString()}>{item.title}</MenuItem>
                                  )
                                })

                              }

                            </Select>
                            {isFormSubmitted && location_definition_id_HasError && <div><FormHelperText error={true}>{location_definition_id_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >

                            <InputLabel>İl</InputLabel>

                            <Autocomplete

                              id="tags-outlined"
                              value={city_id_Value ? JSON.parse(city_id_Value) : null}
                              onChange={(event, newValue) => {
                                city_id_ChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
                              }}
                              options={state.globals.formDatas.cities}
                              getOptionLabel={(option) => option.title}
                              style={{ width: "100%" }}
                              className={(isFormSubmitted && city_id_HasError) ? "has-error" : ""}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password',
                                  }}
                                />
                              )}
                            />
                            {isFormSubmitted && city_id_HasError && <div><FormHelperText error={true}>{city_id_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >

                            <InputLabel>İlçe</InputLabel>

                            <Autocomplete

                              id="tags-district_id"
                              value={district_id_Value ? JSON.parse(district_id_Value) : null}
                              onChange={(event, newValue) => {
                                district_id_ChangeHandler(newValue ? JSON.stringify(newValue) : "", "setValue");
                              }}
                              options={districts}
                              getOptionLabel={(option) => option.title}
                              style={{ width: "100%" }}
                              className={(isFormSubmitted && district_id_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update") || city_id_Value === ""}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  inputProps={{
                                    ...params.inputProps,
                                    autoComplete: 'new-password',

                                  }}
                                />
                              )}
                            />
                            {isFormSubmitted && district_id_HasError && <div><FormHelperText error={true}>{district_id_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Adres
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="address"
                              name="address"
                              autoComplete="new-password"
                              multiline
                              rows={2}
                              value={addressValue}
                              onChange={addressChangeHandler}
                              onBlur={addressBlurHandler}
                              className={(isFormSubmitted && addressHasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && addressHasError && <div><FormHelperText error={true}>{addressValidReason}</FormHelperText></div>}

                          </Grid>

                        </Grid>
                        <Grid xs={4}>
                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Toplam Çalışan Sayısı
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="employee_count"
                              name="employee_count"
                              autoComplete="off"
                              type="number"
                              value={employee_count_Value}
                              onChange={employee_count_ChangeHandler}
                              onBlur={employee_count_BlurHandler}
                              className={(isFormSubmitted && employee_count_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && employee_count_HasError && <div><FormHelperText error={true}>{employee_count_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Üretim / Hizmet Çalışan Sayısı
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="production_employee_count"
                              name="production_employee_count"
                              autoComplete="off"
                              type="number"
                              value={production_employee_count_Value}
                              onChange={production_employee_count_ChangeHandler}
                              onBlur={production_employee_count_BlurHandler}
                              className={(isFormSubmitted && production_employee_count_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && production_employee_count_HasError && <div><FormHelperText error={true}>{production_employee_count_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Aynı İşi Yapan Çalışan Sayısı
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="double_up_employee_count"
                              name="double_up_employee_count"
                              autoComplete="off"
                              type="number"
                              value={double_up_employee_count_Value}
                              onChange={double_up_employee_count_ChangeHandler}
                              onBlur={double_up_employee_count_BlurHandler}
                              className={(isFormSubmitted && double_up_employee_count_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && double_up_employee_count_HasError && <div><FormHelperText error={true}>{double_up_employee_count_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Vardiyada Yapılan İşin Niteliği
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="nature_of_business"
                              name="nature_of_business"
                              autoComplete="off"
                              value={nature_of_business_Value}
                              onChange={nature_of_business_ChangeHandler}
                              onBlur={nature_of_business_BlurHandler}
                              className={(isFormSubmitted && nature_of_business_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && nature_of_business_HasError && <div><FormHelperText error={true}>{nature_of_business_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Vardiya Sayısı
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="shift_count"
                              name="shift_count"
                              autoComplete="off"
                              type="number"
                              value={shift_count_Value}
                              onChange={shift_count_ChangeHandler}
                              onBlur={shift_count_BlurHandler}
                              className={(isFormSubmitted && shift_count_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && shift_count_HasError && <div><FormHelperText error={true}>{shift_count_ValidReason}</FormHelperText></div>}

                          </Grid>


                        </Grid>
                        <Grid xs={4}>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Yönetim / İdari Görevli Sayısı
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="management_employee_count"
                              name="management_employee_count"
                              autoComplete="off"
                              type="number"
                              value={management_employee_count_Value}
                              onChange={management_employee_count_ChangeHandler}
                              onBlur={management_employee_count_BlurHandler}
                              className={(isFormSubmitted && management_employee_count_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && management_employee_count_HasError && <div><FormHelperText error={true}>{management_employee_count_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Yarı Zamanlı Çalışan Sayısı
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="parttime_employee_count"
                              name="parttime_employee_count"
                              autoComplete="off"
                              type="number"
                              value={parttime_employee_count_Value}
                              onChange={parttime_employee_count_ChangeHandler}
                              onBlur={parttime_employee_count_BlurHandler}
                              className={(isFormSubmitted && parttime_employee_count_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && parttime_employee_count_HasError && <div><FormHelperText error={true}>{parttime_employee_count_ValidReason}</FormHelperText></div>}

                          </Grid>

                          <Grid xs={11}
                            style={{ marginBottom: "15px" }}
                          >
                            <InputLabel>
                              Şube Temsilcisi
                            </InputLabel>
                            <TextField
                              fullWidth
                              id="branch_agent"
                              name="branch_agent"
                              autoComplete="off"
                              value={branch_agent_Value}
                              onChange={branch_agent_ChangeHandler}
                              onBlur={branch_agent_BlurHandler}
                              className={(isFormSubmitted && branch_agent_HasError) ? "has-error" : ""}
                              disabled={!authCtx.user.scopes.includes("client.update")}
                            />
                            {isFormSubmitted && branch_agent_HasError && <div><FormHelperText error={true}>{branch_agent_ValidReason}</FormHelperText></div>}

                          </Grid>


                          <Grid xs={11}
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
                      </Box>

                    </CardContent>
                    <Divider />
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        p: 2,
                        pb: 0
                      }}
                    >
                      {
                        authCtx.user.scopes.includes("client.update") &&
                        <Button
                          color="primary"
                          variant="contained"
                          onClick={submitHandler}
                        >
                          {
                            mode === "edit" &&
                            "KAYDET"
                          }
                          {
                            mode === "create" &&
                            "EKLE"
                          }
                        </Button>
                      }
                    </Box>


                  </TabPanel>
                  <TabPanel value="3"></TabPanel>
                  <TabPanel value="4"></TabPanel>
                </TabContext>
              </Box>
            </Card>
            {
              !props.isModal &&
              <Step2LocationList locationListRefresher={locationListRefresher} handleEdit={handleEdit} />
            }
          </Box>


          {
              authCtx.user.scopes.includes("revision.view") && !props.isModal && mode !== "create" &&
              <Revisions model="location" id={editedLocationId} />
            }
 

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

export default Step2Locations;
