import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { TTodo } from '../types/todo';

type TodoState = {
    todos: TTodo[];
    doneTodos: TTodo[];
    input: string;
};

const initialState: TodoState = {
    todos: [],
    doneTodos: [],
    input: '',
};

type TodoAction =
    | { type: 'SET_INPUT'; value: string }
    // id를 액션 외부(dispatch 호출 시점)에서 생성해 넘겨줍니다.
    // 리듀서는 순수 함수여야 하므로 Date.now() 같이 호출마다 결과가 달라지는
    // 함수를 내부에서 직접 호출하면 안 됩니다.
    | { type: 'ADD_TODO'; id: number }
    | { type: 'COMPLETE_TODO'; todo: TTodo }
    | { type: 'DELETE_DONE_TODO'; todo: TTodo };

function todoReducer(state: TodoState, action: TodoAction): TodoState {
    switch (action.type) {
        case 'SET_INPUT':
            return { ...state, input: action.value };

        case 'ADD_TODO': {
            const text = state.input.trim();
            if (!text) return state;
            // id는 외부에서 주입받으므로 reducer가 순수 함수로 유지됩니다.
            const newTodo: TTodo = { id: action.id, text };
            return { ...state, todos: [...state.todos, newTodo], input: '' };
        }

        case 'COMPLETE_TODO':
            return {
                ...state,
                todos: state.todos.filter((t) => t.id !== action.todo.id),
                doneTodos: [...state.doneTodos, action.todo],
            };

        case 'DELETE_DONE_TODO':
            return {
                ...state,
                doneTodos: state.doneTodos.filter((t) => t.id !== action.todo.id),
            };

        default:
            return state;
    }
}

type TodoContextType = {
    state: TodoState;
    dispatch: React.Dispatch<TodoAction>;
};

const TodoContext = createContext<TodoContextType | null>(null);

export const TodoProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(todoReducer, initialState);

    return (
        <TodoContext.Provider value={{ state, dispatch }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo는 TodoProvider 내부에서만 사용할 수 있습니다.');
    }
    return context;
};
