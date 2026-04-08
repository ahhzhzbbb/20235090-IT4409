function ResultTable({ results }) {
  return (
    <section className="result-section">
      <h2>Ket qua hoc tap</h2>
      <table>
        <thead>
          <tr>
            <th>STT</th>
            <th>Hoc ky</th>
            <th>Ma mon</th>
            <th>Ten mon</th>
            <th>Diem QT</th>
            <th>Diem CK</th>
          </tr>
        </thead>
        <tbody>
          {results.map((item, index) => (
            <tr key={`${item.studentId}-${item.courseCode}-${item.semester}`}>
              <td>{index + 1}</td>
              <td>{item.semester}</td>
              <td>{item.courseCode}</td>
              <td>{item.courseName}</td>
              <td>{item.midtermScore}</td>
              <td>{item.finalScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default ResultTable;
