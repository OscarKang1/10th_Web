interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

const todoInput = document.getElementById('todo-input-field') as HTMLInputElement;
const todoList = document.getElementById('todo-list') as HTMLUListElement;
const doneList = document.getElementById('done-list') as HTMLUListElement;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;

// [피드백 1 반영] JSON.parse 결과에 명시적으로 as Todo[] 단언 추가
let todos: Todo[] = JSON.parse(localStorage.getItem('todos') || '[]') as Todo[];

const init = (): void => {
    render();
    
    // [피드백 2 반영] 이벤트 핸들러 로직 중복 제거를 위한 공통 처리
    const handleAddEvent = (e?: KeyboardEvent) => {
        if (e && e.isComposing) return;
        if (e && e.key !== 'Enter') return;
        addTodo();
    };

    // 옵셔널 체이닝 대신 안전한 이벤트 바인딩
    todoInput?.addEventListener('keydown', handleAddEvent);
    addBtn?.addEventListener('click', () => handleAddEvent());
};

const addTodo = (): void => {
    /* [피드백 3 반영] 타입 가드를 통한 null 체크 및 값 접근 안전성 강화 */
    if (!todoInput) return;
    
    const text = todoInput.value.trim();
    if (!text) return;

    const newTodo: Todo = {
        id: Date.now(),
        text,
        completed: false
    };

    todos.push(newTodo);
    syncAndUpdate(); // 업데이트 함수 호출
    todoInput.value = '';
};

const toggleTodo = (id: number): void => {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    syncAndUpdate();
};

const deleteTodo = (id: number): void => {
    todos = todos.filter(todo => todo.id !== id);
    syncAndUpdate();
};

/* [피드백 4 반영] 데이터 변경과 저장을 일관성 있게 관리하는 함수명 변경 및 구조 */
// 함수가 호출될 때마다 무조건 로컬스토리지와 UI를 동기화하여 누락 방지
const syncAndUpdate = (): void => {
    localStorage.setItem('todos', JSON.stringify(todos));
    render();
};

const render = (): void => {
    if (!todoList || !doneList) return; // DOM 존재 여부 체크

    /* 기존 방식: todoList.innerHTML = ''; */
    // 피드백 반영: 전체 렌더링 방식은 유지하되 안정성 강화
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'task-item';

        const span = document.createElement('span');
        span.className = `task-item__text ${todo.completed ? 'task-item__text--completed' : ''}`;
        span.textContent = todo.text;

        const btnGroup = document.createElement('div');
        btnGroup.className = 'task-item__btn-group';

        const actionBtn = document.createElement('button');
        actionBtn.className = 'task-item__button task-item__button--complete';
        actionBtn.textContent = todo.completed ? '취소' : '완료';
        actionBtn.onclick = () => toggleTodo(todo.id);

        const delBtn = document.createElement('button');
        delBtn.className = 'task-item__button task-item__button--delete';
        delBtn.textContent = '삭제';
        delBtn.onclick = () => deleteTodo(todo.id);

        btnGroup.append(actionBtn, delBtn);
        li.append(span, btnGroup);

        if (todo.completed) {
            doneList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }
    });
};

init();