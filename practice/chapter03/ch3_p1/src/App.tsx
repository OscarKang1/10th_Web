import './App.css';
import { Link, Route, Routes } from './router';

const MatthewPage = () => <h1>오스카 페이지</h1>;
const AeongPage = () => <h1>이든 페이지</h1>;
const JoyPage = () => <h1>메이슨 페이지</h1>;
const NotFoundPage = () => <h1>404</h1>;

const Header = () => {
  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link to='/oscar'>OSCAR</Link>
      <Link to='/ethen'>ETHEN</Link>
      <Link to='/maison'>MAISON</Link>
      <Link to='/not-found'>NOT FOUND</Link>
    </nav>
  );
};

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/oscar' component={MatthewPage} />
        <Route path='/ethen' component={AeongPage} />
        <Route path='/maison' component={JoyPage} />
        <Route path='/not-found' component={NotFoundPage} />
      </Routes>
    </>
  );
}

export default App;