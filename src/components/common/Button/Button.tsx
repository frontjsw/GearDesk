import "./Button.scss";

const Button = ({ label, ...rest }) => {
  return (
    <button type="button" className="btn" {...rest}>
      {label}
    </button>
  );
};

export default Button;
