import type { TTodo } from '../types/todo';
import { useTodo } from '../context/TodoContext';
import TodoForm from './TodoForm';
import TodoList from './TodoList';

const Todo = () => {
    // 로컬 useState 대신 Context에서 상태를 가져와 TodoList에 props로 전달합니다.
    const { state, dispatch } = useTodo();

    const completeTodo = (todo: TTodo) => {
        dispatch({ type: 'COMPLETE_TODO', todo });
    };

    const deleteTodo = (todo: TTodo) => {
        dispatch({ type: 'DELETE_DONE_TODO', todo });
    };

    return (
        <div className="todo-container">
            <h1 className="todo-container__header">Oscar Todo</h1>

            <TodoForm />

            <div className="render-container">
                <TodoList
                    title="할 일"
                    todos={state.todos}
                    buttonLabel="완료"
                    buttonColor="#28a745"
                    onAction={completeTodo}
                />
                <TodoList
                    title="완료"
                    todos={state.doneTodos}
                    buttonLabel="삭제"
                    buttonColor="#dc3545"
                    onAction={deleteTodo}
                />
            </div>
        </div>
    );
};

export default Todo;
