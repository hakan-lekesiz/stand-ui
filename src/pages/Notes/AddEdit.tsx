import { useState, useEffect, useContext } from "react";
import { useStore } from '../../store/store';
import AuthContext from '../../store/auth-context';
import useInput from '../../store/use-input';
import { useParams } from "react-router-dom";
import {
  Box, Snackbar, CardContent, Grid, InputLabel,
  TextField, FormHelperText, MenuItem, Select, Button, Divider, CircularProgress
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { tr } from "date-fns/locale";

import Revisions from "../../components/Revisions/Revisions";


const NoteAddEdit = (props: any) => {
  const authCtx: any = useContext(AuthContext);
  const [state, dispatch] = useStore();
  let { id } = useParams<"id">();

  const [isFormSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [showError, setShowError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [mode, setMode] = useState<string>("create");
  const [showSpinner, setShowSpinner] = useState<boolean>(true);
  const [remindDate, setRemindDate] = useState<Date | null>(null);

  useEffect(() => {

    if (state.globals.formDatas.noteIsCompletedOptions.length > 0) {
      setShowSpinner(false);
    }
    else {
      setTimeout(() => {
        dispatch('SET_UPDATE');
      }, 1000);
    }
  }, [state]);

  useEffect(() => {
    if (props.editingNote) {
      setMode("edit");
      contentChangeHandler(props.editingNote.content, "setValue");
      setRemindDate(props.editingNote.remind_at ? new Date(props.editingNote.remind_at) : null);
      remind_at_ChangeHandler(props.editingNote.remind_at, "setValue");
      completedChangeHandler(props.editingNote.completed.toString(), "setValue");
    }

  }, [props.editingNote]);

  let isAuth = authCtx.user.scopes.includes("note.viewAny") || authCtx.user.scopes.includes("note.update");

  const {
    value: contentValue,
    isValid: contentIsValid,
    isTouched: contentIsTouched,
    validReason: contentValidReason,
    hasError: contentHasError,
    valueChangeHandler: contentChangeHandler,
    inputBlurHandler: contentBlurHandler,
    reset: resetContent,
  } = useInput(["required"]);

  const {
    value: remind_at_Value,
    isValid: remind_at_IsValid,
    isTouched: remind_at_IsTouched,
    validReason: remind_at_ValidReason,
    hasError: remind_at_HasError,
    valueChangeHandler: remind_at_ChangeHandler,
    inputBlurHandler: remind_at_BlurHandler,
    reset: reset_remind_at,
  } = useInput([]);

  const {
    value: completedValue,
    isValid: completedIsValid,
    isTouched: completedIsTouched,
    validReason: completedValidReason,
    hasError: completedHasError,
    valueChangeHandler: completedChangeHandler,
    inputBlurHandler: completedBlurHandler,
    reset: resetCompleted,
  } = useInput(["required"]);

  let formIsValid = false;

  if (contentIsValid && remind_at_IsValid && completedIsValid) {
    formIsValid = true;
  }

  const submitHandler = async (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);

    if (!formIsValid) {
      return;
    }

    const date = remindDate ? remindDate.toLocaleDateString().split(".") : null;
    const time = remindDate ? remindDate.toLocaleTimeString().split(":") : null;
    let note: any = {};
    if (mode === "edit") {
      note = {
        notable_id: props.editingNote.notable_id,
        notable_type: props.editingNote.notable_type,
        content: contentValue,
        remind_at: (date && time) ? (date[2] + "-" + date[1] + "-" + date[0] + " " + time[0] + ":" + time[1]) : null,
        completed: completedValue === "null" ? null : completedValue,
      };
    }
    else {
      note = {
        notable_id: id,
        notable_type: props.notable_type,
        content: contentValue,
        remind_at: (date && time) ? (date[2] + "-" + date[1] + "-" + date[0] + " " + time[0] + ":" + time[1]) : null,
        completed: completedValue === "null" ? null : completedValue,
      };
    }

    let url = mode === "edit" ? ("/" + props.editingNote.id) : "";
    const result: any = await fetch(state.globals.routes.note + url, {
      method: mode === "edit" ? 'PUT' : 'POST',
      body: JSON.stringify(note),
      headers: {
        'content-type': 'application/json',
        'accept': 'application/json'
      },
    })

    const resData = await result.json();

    if (result.ok) {
      setMode("create");
      setFormSubmitted(false);
      setRemindDate(null);
      resetCompleted();
      reset_remind_at();
      resetContent();
      props.getFilteredData();

    }
    else {
      setErrorMessage(resData.message);
      setShowError(true);
    }
  };

  if (!isAuth) {
    return (
      <div>
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
          <CardContent>

            <Box component="form" noValidate sx={{ display: "flex", flexWrap: "wrap" }}>
              <Grid xs={10}>

                <Grid xs={11}
                  style={{ marginBottom: "15px" }}
                >
                  <InputLabel>
                    İçerik
                  </InputLabel>
                  <TextField
                    fullWidth
                    id="content"
                    name="content"
                    autoComplete="new-password"
                    multiline
                    rows={6}
                    value={contentValue}
                    onChange={contentChangeHandler}
                    onBlur={contentBlurHandler}
                    className={(isFormSubmitted && contentHasError) ? "has-error" : ""}
                    disabled={!authCtx.user.scopes.includes("note.update")}
                  />
                  {isFormSubmitted && contentHasError && <div><FormHelperText error={true}>{contentValidReason}</FormHelperText></div>}

                </Grid>

              </Grid>
              <Grid xs={2} sx={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end" }}>

                <Grid xs={12}
                  style={{ marginBottom: "15px" }}
                >

                  <InputLabel>Not</InputLabel>
                  <Select sx={{ width: "100%" }}
                    id="completed"
                    name="completed"
                    value={completedValue}
                    onChange={completedChangeHandler}
                    onBlur={completedBlurHandler}
                    className={(isFormSubmitted && completedHasError) ? "has-error" : ""}
                    disabled={!authCtx.user.scopes.includes("note.update")}
                  >

                    {
                      state.globals.formDatas.noteIsCompletedOptions.map((item: any) => {

                        return (
                          <MenuItem key={"completed_" + item.id} value={item.id.toString()}>{item.title}</MenuItem>
                        )
                      })

                    }

                  </Select>
                  {isFormSubmitted && completedHasError && <div><FormHelperText error={true}>{completedValidReason}</FormHelperText></div>}

                </Grid>
                <Grid xs={12}>
                  <InputLabel>Hatırlatma Tarihi</InputLabel>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={tr} >
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      value={remindDate}
                      onChange={(newValue) => {
                        setRemindDate(newValue ? newValue : null);
                        remind_at_ChangeHandler(newValue ? newValue.toString() : "", "setValue");
                      }}
                    />
                  </LocalizationProvider>
                  {isFormSubmitted && remind_at_HasError && <div><FormHelperText error={true}>{remind_at_ValidReason}</FormHelperText></div>}

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
              authCtx.user.scopes.includes("note.update") &&
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

export default NoteAddEdit;
