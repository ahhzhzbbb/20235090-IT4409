function SearchForm({ studentId, onStudentIdChange, onSearch, isLoading }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <label htmlFor="student-id">Ma so sinh vien</label>
      <input
        id="student-id"
        type="text"
        placeholder="VD: SV001"
        value={studentId}
        onChange={(event) => onStudentIdChange(event.target.value)}
      />
      <button type="submit" disabled={isLoading}>
        Tra cuu
      </button>
    </form>
  );
}

export default SearchForm;
