let div = document.querySelector('.container');
let input = document.createElement('input');
input.classList.add('text-field__input');
input.classList.add('cursorText');  
input.placeholder = 'Добавьте дело [Enter]';
let ul = document.querySelector('ul');
div.prepend(input);
input.focus();
ul.addEventListener('click', deleteTask);
ul.addEventListener('click', doneTask);
ul.addEventListener('dblclick', editTask);
let select = document.getElementById('filter');
let clearBtn = document.getElementById('clearFinishedTasks');
clearBtn.addEventListener('click', clearFn);
select.addEventListener('change', finishedTasks);
select.addEventListener('change', activeTasks);
select.addEventListener('change', allTasks);

let tasks = [];
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
}

const showHideRemoveBtn = function showRemoveButton(event) { 
    if (event.target.tagName === 'SPAN' || event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') { 
        this.children[2].classList.add('show');
    }
    else {
        this.children[2].classList.remove('show');
    }         
}
for (i = 0; i < ul.children.length; i++) {
    ul.children[i].addEventListener('mouseover', showHideRemoveBtn)
}

tasks.forEach( function (task) {
    let li = document.createElement('li');
    let span = document.createElement('span');
    span.id = 'span';
    span.innerHTML = input.value;
    span.dataset.action = 'edit';
    let button = document.createElement('button');
    button.innerHTML = 'х';
    button.classList.add('deleteBtn');
    button.classList.add('hide');
    button.dataset.action = 'delete';
    let checkbox = document.createElement('input') ;
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkboxClass');
    checkbox.dataset.action = 'checkbox';
    if (task.done) {
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkboxClass');
        checkbox.dataset.action = 'checkbox';
        checkbox.id = 'check';
        checkbox.checked = true;
    } else {
        checkbox.type = 'checkbox';
        checkbox.classList.add('checkboxClass');
        checkbox.dataset.action = 'checkbox';
        checkbox.id = 'check';
        checkbox.checked = false;
    } 
    const cssClass = task.done ? 'span-done' : 'none';
    li.id = `${task.id}`;
    span.innerHTML = `${task.text}`;
    span.classList.add(`${cssClass}`); 
    let clearBtn = document.getElementById('clearFinishedTasks');
    span.classList[0] == 'span-done' ? clearBtn.classList.add('show') : clearBtn.classList.add('hide');    
    ul.append(li);
    li.prepend(checkbox);
    li.append(span);
    li.append(button);

    for (i = 0; i < ul.children.length; i++) {ul.children[i].addEventListener('mouseover', showHideRemoveBtn)}

    countTasks();
    return ul;
})

input.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && this.value.trim()) {
        addTask('', false);
    }  
})

function addTask() {    
    let li = document.createElement('li');
    let span = document.createElement('span');
    span.id = 'span';
    span.innerHTML = input.value;
    span.dataset.action = 'edit';
    let button = document.createElement('button');
    button.innerHTML = 'х';
    button.classList.add('deleteBtn');
    button.classList.add('hide');
    button.dataset.action = 'delete';
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('checkboxClass');
    checkbox.dataset.action = 'checkbox';   
    let taskText = span.innerHTML;
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    }
    tasks.push(newTask);
    const cssClass = newTask.done ? 'span-done' : 'none';
    li.id = `${newTask.id}`;
    span.innerHTML = `${newTask.text}`;
    span.classList.add(`${cssClass}`);
    ul.append(li);
    li.prepend(checkbox);
    li.append(span);
    li.append(button);
    input.focus();
    input.value = '';  
    
    for (i = 0; i < ul.children.length; i++) {ul.children[i].addEventListener('mouseover', showHideRemoveBtn)}
    
    hideShowClearBtn()
    countTasks();
    saveToLS();
    return ul;
}

function hideRemoveButton(event) {
    if (event.target.tagName === 'SPAN' || event.target.tagName === 'INPUT') { 
        this.children[2].classList.remove('show');
    }
    else {
        this.children[2].classList.add('show');
    }    
}

function deleteTask(event) {   
    if(event.target.dataset.action !== 'delete') return;
    const parentNode = event.target.closest('li');
    const id = parentNode.id;
    const index = tasks.findIndex( function (task) {
        if (task.id == id) return true        
     });
    tasks.splice(index, 1);
    parentNode.remove();
    input.focus();
    hideShowClearBtn();     
    countTasks();
    saveToLS();   
}

function doneTask(event) { 
    if (event.target.dataset.action === 'checkbox' ) {     
        const parentNode = event.target.closest('li');
        const id = parentNode.id;        
        const task = tasks.find( function (task) {
            if (task.id == id) {
                return true;
            }
        })
        task.done = !task.done;
        const taskTitle = parentNode.querySelector('span');
        taskTitle.classList.toggle('span-done');
        saveToLS();
    }  
    hideShowClearBtn();    
}

function editTask(event) {    
    if(event.target.dataset.action === 'edit') {
        let span = event.target;
        let input = document.createElement('input');
        input.type = 'text';        
        input.value = span.innerText;
        span.innerText = '';
        span.append(input);
        input.focus();
        input.addEventListener('blur', function() {
            if (!this.value.trim()) return;
            span.innerText = this.value;
            for (let key in tasks) {
                for (let i = 0; i < ul.children.length; i++) {
                    if(tasks[key].id === +event.target.parentNode.getAttribute('id')) {
                        tasks[key].text = event.target.innerText;
                        saveToLS();                            
                    }
                }
            }
        }       
    )}
}

function finishedTasks() {
    if (this.value === 'finishedTasks') {         
        clearBtn.classList.add('show');  
        clearBtn.classList.remove('hide');        
        for (let key in tasks) {            
            if(tasks[key].done === true) {
                for (let i = 0; i < ul.children.length; i++) {
                    if (tasks[key].id === +ul.children[i].getAttribute('id')) {   
                        ul.children[i].classList.add('showList');
                        ul.children[i].classList.remove('hide');        
                    }
                }
            }
            else {
                for (let i = 0; i < ul.children.length; i++) {
                    if (tasks[key].id === +ul.children[i].getAttribute('id')) {       
                        ul.children[i].classList.add('hide');
                        ul.children[i].classList.remove('showList');        
                    }
                }
            }
            saveToLS(); 
        } 
    }
}

function activeTasks() {
    if (this.value === 'activeTasks') {
        clearBtn.classList.add('hide');  
        clearBtn.classList.remove('show');
        for (let key in tasks) {
            if(tasks[key].done === false) {
                 
                for (let i = 0; i < ul.children.length; i++) {
                    if (tasks[key].id === +ul.children[i].getAttribute('id')) {     
                        ul.children[i].classList.add('showList');
                        ul.children[i].classList.remove('hide');        
                    }
                }
            }
            else {
                for (let i = 0; i < ul.children.length; i++) {
                    if (tasks[key].id === +ul.children[i].getAttribute('id')) {   
                        ul.children[i].classList.add('hide');
                        ul.children[i].classList.remove('showList');        
                    }
                }
            }           
            saveToLS(); 
        }               
    }
}

function allTasks() {
    if (this.value === 'allTasks') {
        clearBtn.classList.add('show');  
        clearBtn.classList.remove('hide'); 
        for (let key in tasks) {
            if(tasks[key].done === false || tasks[key].done === true) {
                for (let i = 0; i < ul.children.length; i++) {
                    if (tasks[key].id === +ul.children[i].getAttribute('id') || tasks[key].id !== +ul.children[i].getAttribute('id')) {
                        ul.children[i].classList.add('showList');
                        ul.children[i].classList.remove('hide');        
                    }
                }
            }
            saveToLS();
        }  
    }
}

function countTasks() {
    const p = document.getElementById('pId');
    const temp = ul.children.length;
    p.innerHTML = `<i>Всего задач: ${temp}</i>`;
}

function hideShowClearBtn() {
    let checkShowHideClearBtn = ul.getElementsByClassName('span-done');
    if (checkShowHideClearBtn.length > 0) { 
        clearBtn.classList.add('show');  
        clearBtn.classList.remove('hide');
    } else {
        clearBtn.classList.add('hide');         
        clearBtn.classList.remove('show');
    }
    countTasks();
    saveToLS();
}

function clearFn() {
    const spanDone = document.getElementsByClassName('span-done');
    while (spanDone.length) {
        spanDone[0].parentNode.remove(spanDone[0]);
    }
    tasks.forEach(function () {        
        let newTasks = tasks.filter(item => item.done === false);
        tasks = newTasks;
    })
    hideShowClearBtn();
    countTasks();
    saveToLS();
}

function saveToLS() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}



