// @flow
import * as React from 'react';

type Props = {|
  name?: string,
  className?: string,
  defaultValue?: string,
  maxLength?: number,
  required?: boolean,
  error?: boolean,
  errorMessage?: string,
|};

export default function VolunteerActivityReportingQ2({
  name = 'activity_summary',
  className = '',
  defaultValue = '',
  maxLength = 150,
  required = false,
  error = false,
  errorMessage = 'Please limit your response to 150 characters',
}: Props): React.Node {
  const [value, setValue] = React.useState(defaultValue);
  const textareaRef = React.useRef(null);
  const inputClasses = 'var-q2__input' + (error ? ' var-q2__input--error' : '');
  const isOverLimit = value.length > maxLength;
  const counterClasses = 'var-q2__counter' + (isOverLimit ? ' var-q2__counter--over-limit' : '');

  const handleChange = (e) => {
    setValue(e.target.value);
    autoResize();
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  React.useEffect(() => {
    autoResize();
  }, []);

  return (
    <div className={(className || '') + ' var-q2'}>
      <label className="var-q2__label" htmlFor={name}>Summary</label>
      <div className="var-q2__input-wrapper">
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          className={inputClasses}
          maxLength={maxLength}
          defaultValue={defaultValue}
          onChange={handleChange}
          required={required}
        />
        <div className={counterClasses}>{String(value.length)}/{maxLength}</div>
      </div>
      {error && <div className="var-q2__error">{errorMessage}</div>}
    </div>
  );
}
