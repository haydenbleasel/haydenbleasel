import type { FormHTMLAttributes } from 'react';
import classNames from 'classnames/bind';
import styles from './form.module.css';

type IForm = {
  name: string;
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChangeText: any;
  loading: boolean;
} & FormHTMLAttributes<HTMLFormElement>

const cx = classNames.bind(styles);

const Form = ({
  name,
  label,
  placeholder,
  type,
  value,
  onChangeText,
  loading,
  onSubmit,
}: IForm) => (
  <form
    id="newsletter"
    className={cx('newsletter', { loading })}
    onSubmit={onSubmit}
  >
    <fieldset className={styles.fields}>
      <label className={styles.label} htmlFor={name}>
        {label}
      </label>
      <input
        required
        id={name}
        className={styles.input}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={({ target }) => onChangeText(target.value)}
      />
      <button aria-label="Sign up" type="submit" className={styles.button}>
        &rarr;
      </button>
    </fieldset>
  </form>
);

export default Form;
