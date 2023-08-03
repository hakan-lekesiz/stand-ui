import { useState, forwardRef } from 'react';
import { TextField, InputLabel } from '@mui/material';
import NumberFormat from 'react-number-format';




export const PhoneMask = (props: any) => {

    return (

        <NumberFormat
            format="+90 (###) ###-##-##" mask="_" allowEmptyFormatting
            onValueChange={props.phoneChangeHandler}
            onBlur={props.phoneBlurHandler}
            value={props.phoneValue}
            customInput={TextField}
            disabled={props.disabled}
            className={(props.isFormSubmitted && props.phoneHasError) ? "masked-input-01 has-error" : "masked-input-01"}
            style={{ width: "100%" }}
        />

    );
}

export const TcNoMask = (props: any) => {

    return (

        <NumberFormat
            format="###########"
            onValueChange={props.tcNoChangeHandler}
            onBlur={props.tcNoBlurHandler}
            value={props.tcNoValue}
            customInput={TextField}
            disabled={props.disabled}
            className={(props.isFormSubmitted && props.tcNoHasError) ? "masked-input-01 has-error" : "masked-input-01"}
            style={{ width: "100%" }}
        />

    );
}

export const TaxNoMask = (props: any) => {

    return (

        <NumberFormat
            format="##########"
            onValueChange={props.taxNoChangeHandler}
            onBlur={props.taxNoBlurHandler}
            value={props.taxNoValue}
            customInput={TextField}
            disabled={props.disabled}
            className={(props.isFormSubmitted && props.taxNoHasError) ? "masked-input-01 has-error" : "masked-input-01"}
            style={{ width: "100%" }}
        />

    );
}

export const DecimalMask = (props: any) => {
    
    const withValueCap = (inputObj: any) => {
        const { value } = inputObj;
        if (value <= props.max) return true;
        return false;
    };

    return (

        <NumberFormat
            thousandsGroupStyle="thousand"
            prefix="₺"
            decimalSeparator="."
            decimalScale={2}
            fixedDecimalScale={true}
            displayType="input"
            type="text"
            thousandSeparator={true}
            //allowNegative={true}
            onValueChange={props.decimalChangeHandler}
            onBlur={props.decimalBlurHandler}
            value={props.decimalValue}
            customInput={TextField}
            disabled={props.disabled}
            className={(props.isFormSubmitted && props.decimalHasError) ? "masked-input-01 has-error" : "masked-input-01"}
            style={{ width: "100%" }}
            isAllowed={withValueCap}
        />

    );
}