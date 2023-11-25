//Manejando el DOM para interactuar con la tablas y botones
const btnMenu = document.querySelector('.dropdown-menu');
const tableView = document.querySelector('.view');
const add = document.querySelector('.add');
const manageImages = document.querySelector('.manage-images');
const manageCategories = document.querySelector('.manage-categories');
const td = document.querySelector('table');
const modal = document.querySelector('.modal');
const modalForm = document.querySelector('.modal-form');
const inputName = document.querySelector('#name');
const inputCode = document.querySelector('#code');
const inputModel = document.querySelector('#model');
const textareaDescription = document.querySelector('#description');
const inputPrice = document.querySelector('#price');
const inputCount = document.querySelector('#count');
const selectCategory = document.querySelector('#category_id');
const selectImage = document.querySelector('.containerImages');
const inputImage = document.querySelector('#inputImage');
const deleteImage = document.querySelector('.deleteImage');
let imageBefore;
let id;

//Bontón del menú para saber si mostrar la tabla o es para agregar
btnMenu.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'A'){
        console.log(e.target.href);
        switch(e.target.id){
            case 'view':
                Change('view');
                break;
            case 'add':
                Change('add');
                break;
            case 'manage-images':
                Change('manage-images');
                break;
            case 'manage-categories':
                Change('manage-categories');
                break;
        }
    }
});

td.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'TD'){
        id = e.target.parentElement.children[0].children[0].value; //Capturando el ID del producto tr > td > input
        let code = e.target.parentElement.children[1].textContent,
        name = e.target.parentElement.children[2].textContent,
        model = e.target.parentElement.children[3].textContent,
        description = e.target.parentElement.children[4].children[0].textContent,
        price = e.target.parentElement.children[5].textContent,
        count = e.target.parentElement.children[6].textContent,
        category_id = e.target.parentElement.children[7].textContent;

        let re = /\w/g;
        let category = category_id.match(re);
        re = /\d/g;
        let co = code.match(re)

        category = category.join('');
        co = co.join('');

        modal.style.display = 'block';

        inputName.value = name;
        inputModel.value = model;
        inputCode.value = co;
        textareaDescription.value = description;
        inputPrice.value = price;
        inputCount.value = count;

        if(category == 'Cuerpo'){
            selectCategory.selectedIndex = 0;
        }else if(category == 'Manos'){
            selectCategory.selectedIndex = 1;
        }else if(category == 'Cara'){
            selectCategory.selectedIndex = 2;
        }else if(category == 'Piernas'){
            selectCategory.selectedIndex = 3;
        }
    }
});

modal.addEventListener('click', (e) => {
    if(e.target && e.target.tagName === 'BUTTON'){
        if(e.target.className == 'btn-close'){
            modal.style.display = 'none';
        }
        else if(e.target.textContent == 'Guardar cambios'){
            modal.style.display = 'none';
            modalForm.action += 'update/'+id; 
            modalForm.submit()
        }
        else if(e.target.textContent == 'Eliminar'){
            modal.style.display = 'none';
            modalForm.action += 'delete/'+id; 
            modalForm.submit()
        }
    }
});

selectImage.addEventListener('click', (e) => {
   if(e.target && e.target.tagName === 'IMG'){
       inputImage.value = e.target.parentElement.id;
       if(!imageBefore){
        imageBefore = e.target;    
        e.target.classList.toggle("selected");   
       }else{        
        imageBefore = imageBefore;
        imageBefore.classList.remove("selected");
        e.target.classList.toggle("selected");
        imageBefore = e.target;
       }
   }
});

function Change(option){
    if(option == 'view'){
        tableView.style.display = 'table';
        add.style.display = 'none';
        manageImages.style.display = 'none';
        manageCategories.style.display = 'none';
    }else if(option == 'add'){
        tableView.style.display = 'none';
        manageImages.style.display = 'none';
        manageCategories.style.display = 'none';
        add.style.display = 'flex';
    }else if(option == 'manage-images'){
        tableView.style.display = 'none';
        add.style.display = 'none';
        manageCategories.style.display = 'none';
        manageImages.style.display = 'flex';
    }else if(option == 'manage-categories'){
        tableView.style.display = 'none';
        add.style.display = 'none';
        manageImages.style.display = 'none';
        manageCategories.style.display = 'flex';
    }
}

deleteImage.addEventListener('click', (e) => {
    deleteImage.href += deleteImage.id + '/' + e.target.parentElement.parentElement.children[1].id;
});