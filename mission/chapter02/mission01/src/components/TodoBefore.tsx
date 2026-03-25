import { useState, type FormEvent  } from "react";
import type { TTodo } from "../types/todo"; // 왜 type을 안붙이면 오류가 날까요 못 찾네요..?

const Todo = () => {
    const [todos, setTodos] = useState<TTodo[]>([]);
    const [doneTodos, setdoneTodos] = useState<TTodo[]>([]);
    const [input, setInput] = useState<string>('');


    const handleSummit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('동작함')
        const text = input.trim();

        if (text) {
            const newTodo = {id: Date.now(), text};
            setTodos((prevTodos) => [...prevTodos, newTodo])
            setInput('')
        }
    };

    const completeTodo = (todo:TTodo) => {
        setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
        setdoneTodos((prevDoneTodos)  => [...prevDoneTodos, todo])
    }

    const deleteTodo = (todo:TTodo) => {
        setdoneTodos((prevdonetodo) => prevdonetodo.filter((t)=> t.id!== todo.id)
    );

    }
    return (
    <div className="todo-container">
        <h1 className="todo-container__header">Oscar Todo</h1>
        <form onSubmit={handleSummit} className="todo-container__form">
            <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type= 'text'
            className="todo-container__input"
            placeholder="할 일 입력"
            required/>
            <button type="submit" className="todo-container__button">
                할 일 추가
            </button>
        </form>
        <div className="render-container">
            <div className="render-container__section">
                <h2 className="render-container__title"> 할 일</h2>
                <ul id='todo-list' className="render-container__list">
                    {todos.map((todo) => (
                        <li key={todo.id} className="render-container__item">
                        <span className="render-container__item-text">
                            {todo.text}
                        </span>
                        <button 
                            onClick={() => completeTodo(todo)}
                            style={{
                                backgroundColor: '#28a745',
                            }}
                            className="render-container__item-button"
                            >
                            완료
                        </button>
                    </li>
                    ))}
                </ul>
            </div>
            <div className="render-container__section">
                <h2 className="render-container__title"> 삭제</h2>
                <ul id='todo-list' className="render-container__list">
                    {doneTodos.map((doneTodo) => (
                        <li key={doneTodo.id} className="render-container__item">
                        <span className="render-container__item-text">
                            {doneTodo.text}
                        </span>
                        <button 
                            onClick={() => deleteTodo(doneTodo)}
                            style={{
                                backgroundColor: '#dc3545',
                            }}
                            className="render-container__item-button"
                            >
                            삭제
                        </button>
                    </li>
                    ))}
                </ul>
            </div>    
        </div>
    </div>
    )
};

export default Todo;