import React from 'react';
import { useField } from "formik";

/**
 * Text input for basic inputs.
 * @param props 
 * name: used as for the use of the label for the input
 * label: the text used within the label. 
 */
export const MyTextInput = (props) => {
    const [field, meta] = useField(props);
    return (
        <div>
            {props.label !== "" ? <label htmlFor={props.name} className="pt-2">{props.label}</label> : null}
            <input className="form-control" type="string" {...field} {...props} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </div>
    );
};

/**
 * Very similar to the above text input.
 * This component has a side % symbol on the right. 
 * Used for float values. 
 * @param props 
 */
export const MyTextInputPercent = (props) => {
  const [field, meta] = useField(props);
  return (
    <div>
      {props.label !== "" ? <label htmlFor={props.name} className="pt-2">{props.label}</label> : null}
      <div className="input-group">
        <input className="form-control" type="string" {...field} {...props} />
        <div className="input-group-append rounded-right">
          <span className="input-group-text smaller">%</span>
        </div>
      </div>
      {meta.touched && meta.error ? (
        <div className="error">{meta.error}</div>
      ) : null}
    </div>
  );
};
