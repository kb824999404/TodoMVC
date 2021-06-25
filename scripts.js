var $ = function(sel) {
    return document.querySelector(sel);
  };
var $All = function(sel) {
return document.querySelectorAll(sel);
};
var guid = 0;
var CL_COMPLETED = 'Completed';
var CL_SELECTED = 'Selected';
var CL_EDITING = 'Editing';
  
function update() {
    var items = $All('.Todo-List .List-Item');
    var filter = $('.Filter-Item.Selected').innerHTML;
    var leftNum = 0;
    var display;

    items.forEach((item)=>{
        if (!item.classList.contains(CL_COMPLETED)) leftNum++;

        // filters
        display = 'none';
        if (filter === 'All' 
            || (filter === 'Todo' && !item.classList.contains(CL_COMPLETED)) 
            || (filter === 'Completed' && item.classList.contains(CL_COMPLETED))) {

        display = '';
        }
        item.style.display = display;
    });
    saveData();

}
function displayOperation(){
    var items = $All('.List-Item.Selected');
    var operation = $('.Operation');
    if(items.length>0){
        operation.style.display = '';
    }
    else{
        operation.style.display = 'none';
    }
}
  
function addTodo(msg) {
    var todoList = $('.Todo-List');

    var item = document.createElement('div');
    var id = 'item' + guid++;
    item.classList.add("List-Item");
    // item.classList.add("Selected");
    item.setAttribute('id', id);
    item.innerHTML = [
        '<button class="Toggle"></button>',
        '<div class="Msg">'+ msg +'</div>'
    ].join('');

    var msg = item.querySelector('.Msg');

    msg.addEventListener('touchend',function(){
        var selected = item.classList.contains(CL_SELECTED);
        if(!selected){
            item.classList.add(CL_SELECTED);
        }
        else{
            item.classList.remove(CL_SELECTED);
        }
        update();
    })

    var toggle = item.querySelector('.Toggle');

    toggle.value = "false";
    toggle.addEventListener('click', function() {
        toggleItem(id);
    }, false);


    todoList.insertBefore(item, todoList.firstChild);
    update();
}

function removeTodo(id){
    
    var todoList = $('.Todo-List');
    var item = $('#' + id);
    todoList.removeChild(item);
    update();
}

function toggleItem(id){
    var item = $('#' + id);
    var msg = item.querySelector('.Msg');
    var toggle = item.querySelector('.Toggle');
    if(toggle.value=="false"){
        item.classList.add(CL_COMPLETED);
        msg.classList.add(CL_COMPLETED);
        toggle .value = "true";
        toggle .classList.add("Toggle-Checked");
    }
    else{
        item.classList.remove(CL_COMPLETED);
        msg.classList.remove(CL_COMPLETED);
        toggle .value = "false";
        toggle .classList.remove("Toggle-Checked");
    }
    update();
}

function allSelected(isSelected){
    var items = $All('.Todo-List .List-Item');
    items.forEach((item)=>{
        if(isSelected)
            item.classList.add(CL_SELECTED);
        else   
            item.classList.remove(CL_SELECTED); 
    });
    update();
}

function toggleSelected(){
    var items = $All('.Todo-List .List-Item');
    items.forEach((item)=>{
        if(item.classList.contains(CL_SELECTED)){
            var id  = item.id ;
            toggleItem(id);
        }
    });
    update();
}
function clearCompleted(){
    var items = $All('.Todo-List .List-Item');
    items.forEach((item)=>{
        if(item.classList.contains(CL_COMPLETED)){
            var id  = item.id ;
            removeTodo(id);
        }
    });
}

function removeSelected(id){
    var items = $All('.Todo-List .List-Item');
    items.forEach((item)=>{
        if(item.classList.contains(CL_SELECTED)){
            var id  = item.id ;
            removeTodo(id);
        }
    });
}


window.onload = function init() {
    var newTodo = $('.Add-Todo');
    newTodo.addEventListener('keyup', function(ev) {
        // Enter
        if (ev.keyCode !== 13) return;

        var msg = newTodo.value;
        if (msg === '') {
        console.warn('msg is empty');
        return;
        }

        addTodo(msg);
        newTodo.value = '';
    }, false);

    var filters = $All('.Filters .Filter-Item');
    filters.forEach((filter)=>{
        filter.addEventListener('click', function() {
            filters.forEach((item)=>{
                item.classList.remove(CL_SELECTED);
            })
            filter.classList.add(CL_SELECTED);
            update();
        }, false);
    });

    var selectAll = $('.Operation-Area .Select');
    selectAll.addEventListener('click',function(){
        var actived = selectAll.classList.contains('Actived');
        if(!actived){
            selectAll.classList.add('Actived');
        }
        else{
            selectAll.classList.remove('Actived');
        }
        allSelected(!actived);
    });

    $('.Operation-Area .Toggle').addEventListener('click',()=>{
        toggleSelected();
    });

    $('.Operation-Area .Remove').addEventListener('click',()=>{
        removeSelected();
    });

    $('.Operation-Area .Clear').addEventListener('click',()=>{
        clearCompleted();
    });

    loadData();

    update();
};

function loadData(){
   var data_str = window.localStorage.getItem("TodoMVC");
   console.log(data_str);
   if(data_str){
       guid = 0;
       data = JSON.parse(data_str);
       data.forEach((todo)=>{
            var msg = todo.msg;
            var completed = todo.completed;
            addTodo(msg);
            if(completed)
                toggleItem("item"+(guid-1));
       })
   }
}


function saveData(){
    var items = $All('.Todo-List .List-Item');
    var data = []
    items.forEach((item)=>{
        var msg = item.querySelector('.Msg').innerText;
        var completed = item.classList.contains(CL_COMPLETED);
        data.push({
            msg:msg,
            completed:completed
        });
    });
    window.localStorage.setItem("TodoMVC",JSON.stringify(data));
}
