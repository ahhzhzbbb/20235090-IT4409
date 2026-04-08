import { useEffect, useState } from 'react';
import SearchForm from './components/SearchForm';
import ResultTable from './components/ResultTable';

function App() {
  const [studentId, setStudentId] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [student, setStudent] = useState(null);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    if (!searchId) {
      return;
    }

    let isCancelled = false;

    setIsLoading(true);
    setError('');
    setStudent(null);
    setResults([]);

    const timer = setTimeout(async () => {
      try {
        const [studentRes, resultRes] = await Promise.all([
          fetch('/sinhvien.json'),
          fetch('/results.json'),
        ]);

        if (!studentRes.ok || !resultRes.ok) {
          throw new Error('Tai du lieu that bai');
        }

        const students = await studentRes.json();
        const allResults = await resultRes.json();

        const foundStudent = students.find(
          (item) => item.id.toLowerCase() === searchId.toLowerCase()
        );

        if (!foundStudent) {
          if (!isCancelled) {
            setError('Khong tim thay sinh vien voi ma so nay.');
          }
          return;
        }

        const studentResults = allResults.filter(
          (item) => item.studentId.toLowerCase() === searchId.toLowerCase()
        );

        if (!isCancelled) {
          setStudent(foundStudent);
          setResults(studentResults);

          if (studentResults.length === 0) {
            setError('Sinh vien chua co ket qua hoc tap.');
          }
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setError('Khong the tai du lieu. Vui long thu lai.');
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }, 1800);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchId]);

  const handleSearch = () => {
    const normalizedId = studentId.trim();

    if (!normalizedId) {
      setError('Vui long nhap ma so sinh vien.');
      setStudent(null);
      setResults([]);
      return;
    }

    setSearchId(normalizedId);
  };

  return (
    <main className="container">
      <h1>Tra cuu thong tin sinh vien</h1>

      <SearchForm
        studentId={studentId}
        onStudentIdChange={setStudentId}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {isLoading && <p className="loading">Dang tai...</p>}

      {error && !isLoading && <p className="error">{error}</p>}

      {student && !isLoading && (
        <section className="student-info">
          <h2>Thong tin sinh vien</h2>
          <p>
            <strong>Ma so:</strong> {student.id}
          </p>
          <p>
            <strong>Ho ten:</strong> {student.name}
          </p>
          <p>
            <strong>Lop:</strong> {student.className}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
        </section>
      )}

      {!isLoading && results.length > 0 && <ResultTable results={results} />}
    </main>
  );
}

export default App;
