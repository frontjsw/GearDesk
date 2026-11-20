import "./Input.scss";
const Input = ({ label, ref, ...rest }) => {
  return (
    <div className="input-wrap">
      <label className="input-label">{label}</label>
      <input type="text" className="input" ref={ref} {...rest} />
    </div>
  );
};

export default Input;
