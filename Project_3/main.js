const entry = document.getElementById('entry')
const form = document.getElementById('form')
const ul = document.getElementById('todo-list')
const alertP = document.querySelector('.alert')

const clearBtn = document.querySelector('.clear-btn')
const submitBtn = document.querySelector('.submit-btn')
const cancelBtn = document.querySelector('.cancel-btn')

form.addEventListener('submit', addItem)
clearBtn.addEventListener('click', clearItems)
cancelBtn.addEventListener('click', setBackToDefault)

let editFlag = false
let editElement;


//LS
// let items = []
let LSkey = 'items';
let editID; //undefined

//load LS
window.addEventListener('DOMContentLoaded', setupItems)

function addItem(e){
    e.preventDefault()
    let val = entry.value
    //LS
    let id = new Date().getTime().toString()

    if(val && !editFlag){
        createLIS(val, id)
        displayAlert('A new item has been added!', 'alert-success')
        clearBtn.classList.remove('d-none')
    
        //LS
        addToLS(val, id)
    }
    else if(val && editFlag){
        editElement.innerText = val
        displayAlert("Successfully edited", 'alert-success')
        
        //LS
        editLS(val, editID)

        setBackToDefault()
    }
    else{
        displayAlert('You have not entered anything!', 'alert-danger')
    }

    entry.value = null
}

function createLIS(val, id){
    const li = document.createElement('li')
    li.className = 'list-item';
    li.setAttribute('data-id', id)
    li.innerHTML = `
        <p class="text">${val}</p>
        <i class="bi bi-pencil-square"></i>
        <i class="bi bi-check-lg"></i>
        <i class="bi bi-trash"></i>`;

    li.querySelector('.bi.bi-pencil-square').addEventListener('click',editItem)
    li.querySelector('.bi.bi-check-lg').addEventListener('click',checkItem)
    li.querySelector('.bi.bi-trash').addEventListener('click',deleteItem)

    
    ul.append(li)
}

function editItem(){
    console.log('edit')
    console.log(this.previousElementSibling)

    //Editing condition
    editFlag = true

    //LS edit
    editID = this.parentElement.dataset.id

    let pTetx = this.previousElementSibling
    editElement = pTetx

    entry.value = this.previousElementSibling.innerText

    submitBtn.innerText = 'Edit'
    cancelBtn.classList.remove('d-none')
    ul.querySelectorAll('.bi').forEach(i => { 
        i.classList.add('v-none')
    })
    clearBtn.classList.add('d-none')
}
function checkItem(){
    console.log('check')
    console.log(this)
    console.log(this.parentElement)
    this.parentElement.classList.toggle('liChecked')
}
function deleteItem(){
    console.log('delete')
    //LS
    let id = this.parentElement.dataset.id

    ul.removeChild(this.parentElement)
    displayAlert('You remove one item!', 'alert-danger')
    if(ul.children.length === 0){
        clearBtn.classList.add('d-none')
    }

    removeFromLS(id)
}


function displayAlert(mesg, styles){
    alertP.innerText = mesg;
    alertP.classList.add(styles);
    setTimeout(() => {
        alertP.innerText = '';
        alertP.classList.remove(styles) 
    }, 1500);
}

function clearItems(){
    ul.innerHTML = null
    displayAlert('All items were removed!', 'alert-danger')
    clearBtn.classList.add('d-none')

    //LS
    localStorage.clear()
}

function setBackToDefault(){
    editFlag = false;
    editElement = undefined
    //LS
    editID = undefined

    entry.value = null

    submitBtn.innerText = 'Submit'
    cancelBtn.classList.add('d-none')
    ul.querySelectorAll('.bi').forEach(i => { 
        i.classList.remove('v-none')
    })
    clearBtn.classList.remove('d-none')
}

//LS
function addToLS(val, id){
    let obj = {id, val}
    let items = getLS()
    items.push(obj)
    localStorage.setItem(LSkey, JSON.stringify(items))
}

function getLS(){
    return localStorage.getItem(LSkey) ? JSON.parse(localStorage.getItem(LSkey)) : []
}

function removeFromLS(id){
    let items = getLS()
    items = items.filter(item => item.id !== id)
    // override LS
    localStorage.setItem(LSkey, JSON.stringify(items))

    if(items.length === 0){
        localStorage.removeItem(LSkey)
    }
}

function editLS(val, editID){
    let items = getLS()
    items = items.map(item => {
        if(item.id === editID){
            item.val = val
        }
        return item
    })
    // override LS
    localStorage.setItem(LSkey, JSON.stringify(items))
}

function setupItems(){
    //saved in LS 
    console.log(localStorage.getItem(LSkey))

    let items = getLS()
    if(items.length > 0 ){
        items.forEach(item => {
            const {id, val} = item
            
            //view saved
            console.log(val)
            
            createLIS(val)
        })
        clearBtn.classList.remove('d-none')
    }
}

