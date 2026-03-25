import type { FormEvent } from 'react';
import { useTodo } from '../context/TodoContext';

const TodoForm = () => {
    const { state, dispatch } = useTodo();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: 'ADD_TODO' });
    };

    return (
        <form className="todo-container__form" onSubmit={handleSubmit}>
            <input
                className="todo-container__input"
                type="text"
                value={state.input}
                onChange={(e) => dispatch({ type: 'SET_INPUT', value: e.target.value })}
                placeholder="할 일을 입력하세요"
            />
            <button className="todo-container__button" type="submit">추가</button>
        </form>
    );
};

export default TodoForm;
