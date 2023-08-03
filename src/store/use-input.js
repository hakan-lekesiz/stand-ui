import { useReducer } from 'react';

const isNotEmpty = (value) =>typeof value ==="number" ? value.toString().trim() !== '' : value.trim() !== '';
const isEmail = (value) => /(.+)@(.+){2,}\.(.+){2,}/.test(value);
const checkPassword = (value) => value.length > 7;
const checkExact = (value, length) => value.length === length;
const checkCitizenid = (value) => {
  if (value === '') {
    return false;
  }

  value = value.toString();
  let isEleven = /^[0-9]{11}$/.test(value);
  let totalX = 0;
  for (let i = 0; i < 10; i++) {
    totalX += Number(value.substr(i, 1));
  }
  let isRuleX = totalX % 10 == value.substr(10, 1);
  let totalY1 = 0;
  let totalY2 = 0;
  for (let i = 0; i < 10; i += 2) {
    totalY1 += Number(value.substr(i, 1));
  }
  for (let i = 1; i < 10; i += 2) {
    totalY2 += Number(value.substr(i, 1));
  }
  let isRuleY = ((totalY1 * 7) - totalY2) % 10 == value.substr(9, 0);

  return isEleven && isRuleX && isRuleY;

};
const checkUrl = (value) => {
  var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  return !!pattern.test(value);
}

const validationMessage = {
  email: "Lütfen doğru formatta bir e-posta giriniz.",
  required: "Gerekli alan.",
  password: "Şifreniz en az 8 karakter olmalı",
  exact: "Eksik Bilgi",
  citizenid: "Hatalı TC kimlik numarası",
  url: "Hatalı url",
}

const initialInputState = {
  value: '',
  isTouched: false
};

const inputStateReducer = (state, action) => {
  if (action.type === 'INPUT') {
    return { value: action.value, isTouched: state.isTouched };
  }
  if (action.type === 'BLUR') {
    return { isTouched: true, value: state.value };
  }
  if (action.type === 'RESET') {
    return { isTouched: false, value: '' };
  }
  return inputStateReducer;
};

const useInput = (validations) => {
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialInputState
  );

  let valueIsValid = validations.length === 0;
  let validReason = "";


  for (var i = 0; i < validations.length; i++) {
    var validation = validations[i];
    if (validation === "required") {
      valueIsValid = isNotEmpty(inputState.value);
    }
    else if (validation === "email") {
      valueIsValid = isEmail(inputState.value);
    }
    else if (validation === "password") {
      valueIsValid = checkPassword(inputState.value);
    }
    else if (validation.includes("exact")) {
      valueIsValid = checkExact(inputState.value, parseInt(validation.split(":")[1]));
      validation = validation.split(":")[0];
    }
    else if (validation.includes("citizenid")) {
      valueIsValid = checkCitizenid(inputState.value);
    }
    else if (validation.includes("url")) {
      valueIsValid = checkUrl(inputState.value);
    }
    if (!valueIsValid) {
      validReason = validationMessage[validation];
      break;
    }
  }

  const hasError = !valueIsValid;

  const valueChangeHandler = (event, inputType) => {
    if (inputType === "mask") {
      dispatch({ type: 'INPUT', value: event.value });
    }
    else if (inputType === "select") {
      dispatch({ type: 'INPUT', value: event.target.value });
    }
    else if (inputType === "setValue") {
      dispatch({ type: 'INPUT', value: event });
    }
    else {
      dispatch({ type: 'INPUT', value: event.target.value });
    }
  };
  const inputBlurHandler = (event) => {
    dispatch({ type: 'BLUR' });
  };
  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return {
    value: inputState.value,
    isValid: valueIsValid,
    isTouched: inputState.isTouched,
    validReason: validReason,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };
};

export default useInput;
