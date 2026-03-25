import type { TTodo } from '../types/todo';
import { useTodo } from '../context/TodoContext';

interface TodoListProps {
    type: 'todos' | 'doneTodos';
    title: string;
    buttonLabel: string;
    buttonColor: string;
}

const TodoList = ({ type, title, buttonLabel, buttonColor }: TodoListProps) => {
    const { state, dispatch } = useTodo();
    const todos = state[type];

    const handleClick = (todo: TTodo) => {
        if (type === 'todos') {
            dispatch({ type: 'COMPLETE_TODO', todo });
        } else {
            dispatch({ type: 'DELETE_DONE_TODO', todo });
        }
    };

    return (
        <div className="render-container__section">
            <h2 className="render-container__title">{title}</h2>
            <ul className="render-container__list">
                {todos.map((todo) => (
                    <li key={todo.id} className="render-container__item">
                        <span className="render-container__item-text">{todo.text}</span>
                        <button
                            className="render-container__item-button"
                            style={{ backgroundColor: buttonColor }}
                            onClick={() => handleClick(todo)}
                        >
                            {buttonLabel}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TodoList;
