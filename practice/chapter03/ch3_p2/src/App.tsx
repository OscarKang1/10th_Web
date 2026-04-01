import './App.css'

// 1. React Router에서 필요한 함수/컴포넌트를 import
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 2. 경로(path)와 보여줄 화면(element)를 정의
const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>홈 페이지입니다.</h1>,
    errorElement: <h1>너는 없는 경로에 들어왔다 ^ㅁ^ 무야호~!</h1>,
  },
  {
    path: '/movies',
    element: <h1>영화 페이지 입니다.</h1>
  }
]);

// 3. RouterProvider로 router 전달
function App() {
  return <RouterProvider router={router} />
}

export default App;