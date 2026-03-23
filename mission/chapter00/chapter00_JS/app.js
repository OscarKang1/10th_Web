document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const doneList = document.getElementById('done-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // 초기 렌더링 (최초 1회 실행)
    initialRender();

    todoInput.addEventListener('keydown', (e) => {
        if (e.isComposing) return; 
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    function addTodo() {
        const text = todoInput.value.trim();
        if (text === "") {
            alert("할 일을 입력해주세요!");
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: text,
            completed: false
        };

        todos.push(newTodo);
        
        /* 기존 방식: saveAndRender(); (전체 리스트 재렌더링) */
        // 개선 방식: 데이터 저장 후 새 노드만 생성해서 추가
        saveToLocalStorage();
        const newNode = createTodoNode(newTodo);
        todoList.appendChild(newNode);
        
        todoInput.value = "";
    }

    function toggleComplete(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return { ...todo, completed: !todo.completed };
            }
            return todo;
        });

        /* 기존 방식: saveAndRender(); (전체 리스트 재렌더링) */
        // 개선 방식: ID로 해당 요소를 찾아 위치만 이동
        saveToLocalStorage();
        const targetNode = document.querySelector(`[data-id="${id}"]`);
        const todo = todos.find(t => t.id === id);
        
        // 버튼 텍스트 및 스타일 업데이트
        const completeBtn = targetNode.querySelector('.complete-btn');
        completeBtn.textContent = todo.completed ? '취소' : '완료';
        
        if (todo.completed) {
            doneList.appendChild(targetNode);
        } else {
            todoList.appendChild(targetNode);
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);

        /* 기존 방식: saveAndRender(); (전체 리스트 재렌더링) */
        // 개선 방식: ID로 해당 요소를 찾아 DOM에서 즉시 제거
        saveToLocalStorage();
        const targetNode = document.querySelector(`[data-id="${id}"]`);
        if (targetNode) targetNode.remove();
    }

    function saveToLocalStorage() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    /* 기존 saveAndRender()와 renderTodos()는 통합 및 분리됨 */
    // 개별 노드를 생성하는 로직 분리 (재사용성)
    function createTodoNode(todo) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-id', todo.id); // ID를 DOM에 기록하여 추적 가능하게 함

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = todo.text;
        if (todo.completed) {
            span.classList.add('completed-text');
        }

        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn'; // 선택을 위해 클래스 추가
        completeBtn.textContent = todo.completed ? '취소' : '완료';
        completeBtn.addEventListener('click', () => toggleComplete(todo.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(btnGroup);

        return li;
    }

    // 초기 로드 시 한 번만 전체를 그리는 함수
    function initialRender() {
        todoList.innerHTML = '';
        doneList.innerHTML = '';
        todos.forEach(todo => {
            const node = createTodoNode(todo);
            if (todo.completed) {
                doneList.appendChild(node);
            } else {
                todoList.appendChild(node);
            }
        });
    }
});