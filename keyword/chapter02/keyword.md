function MyComponent() {
  return (
    <>
      <h1>제목</h1>
      <p>내용입니다.</p>
    </>
  );
}
이유: 빈 태그(react fragment)를 사용하여 실제 브라우저의 DOM에서는 아무런 태그도 남기지 않으면서, 여러 요소를 하나로 묶어줄 수 있습니다.





- 구조분해 할당 활용
    
    함수 내부에서 분해하는 방법이 기억이 납니다.
const list = (porps) => {
const {tech,etc.........} = props;

return (
<li>{tech}</li>
);
};

게으른 초기화는 초기값 설정 시 불필요한 연산을 방지하기 위한 기술입니다.

아래 보이는 예시 같이 일반 방식은 리엑트가  리렌더링 될때마다 heavywork을 계속 실행합니다.

하지만 게으른 초기화 방식은 처음 실행할때만 한번 실행해서 초기값으로 쓰는 것이기에 첫번째 렌더링때만 직접 실행됩니다.

// 일반 방식
useState(heavyWorkd()) 

// 게으른 초기화 방식
useState(() => heavyWorkd())

import './App.css'
import {useState}  from 'react';

function App() {
  const[count, setCount] = useState(0) 

  const handleIncreaseNumber = () => {
    setCount(count+1)
  }
  const handleDecreaseNumber = () => {
    setCount(count-1)
  }

  return (
    <>
    <h1>{count}</h1>
    <button onClick= {handleIncreaseNumber}>숫자 증가 </button>
    <button onClick= {handleDecreaseNumber}>숫자 감소 </button>
    </>
  )
}

export default App

## useState 게으른 초기화 (Lazy Initialization)

### 1. 개념 및 동작 원리

- **개념**: `useState`의 초기값으로 변수가 아닌 **익명 함수**를 전달하는 기법.
- **동작**: 리액트는 전달된 함수를 **최초 렌더링 시점에 딱 한 번만 실행**하여 초기 상태를 설정함. 그 이후 리렌더링 시에는 해당 함수를 다시 실행하지 않음.

### 2. 일반 방식과 차이점

- **일반 초기화 (`useState(getValue())`)**: 컴포넌트가 리렌더링될 때마다 `getValue()`가 매번 호출됨. 결과값은 리액트가 무시하지만 호출 자체로 자원이 낭비됨.
- **게으른 초기화 (`useState(() => getValue())`)**: 리액트가 함수 실행의 제어권을 가짐. 첫 렌더링 이후에는 함수 호출을 스킵하므로 불필요한 연산을 방지함.