import "./SearchArea.scss";
const SearchArea = ({ children, onSubmit }: React.ReactNode) => {
  return (
    <form onSubmit={onSubmit} className="search-area">
      {children}
    </form>
  );
};

export default SearchArea;
