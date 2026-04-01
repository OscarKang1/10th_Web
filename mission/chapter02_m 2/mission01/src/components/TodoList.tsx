import type { TTodo } from '../types/todo';

// Context의 state[type]으로 직접 조회하는 대신 todos 배열을 props로 주입받아
// Context 구조 변경 시 이 컴포넌트를 수정할 필요가 없고, 재사용성도 높아집니다.
interface TodoListProps {
    title: string;
    todos: TTodo[];
    buttonLabel: string;
    buttonColor: string;
    onAction: (todo: TTodo) => void;
}

const TodoList = ({ title, todos, buttonLabel, buttonColor, onAction }: TodoListProps) => {
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
                            onClick={() => onAction(todo)}
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
