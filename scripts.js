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

}
  
function addTodo(msg) {
    var todoList = $('.Todo-List');

    var item = document.createElement('div');
    var id = 'item' + guid++;
    item.classList.add("List-Item");
    item.setAttribute('id', id);
    item.innerHTML = [
        '<button class="Toggle"></button>',
        '<div class="Msg">'+ msg +'</div>'
    ].join('');

    var toggle = item.querySelector('.Toggle');

    toggle.value = "false";
    toggle.addEventListener('click', function() {
        var item = $('#' + id);
        var msg = item.querySelector('.Msg');
        if(this.value=="false"){
            item.classList.add(CL_COMPLETED);
            msg.classList.add(CL_COMPLETED);
            this.value = "true";
            this.classList.add("Toggle-Checked");
        }
        else{
            item.classList.remove(CL_COMPLETED);
            msg.classList.remove(CL_COMPLETED);
            this.value = "false";
            this.classList.remove("Toggle-Checked");
        }
        update();
    }, false);


    todoList.insertBefore(item, todoList.firstChild);
    update();
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

    update();
};
