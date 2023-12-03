const ordenar = document.querySelector('#ordenar');

ordenar.addEventListener('click', () => {

let texto = ordenar.textContent;

if(texto == "Listar"){
ordenar.textContent = 'Casillar';
document.querySelector('.container-products').classList.remove('grid');
document.querySelector('.container-products').classList.add('list');
}else if(texto == 'Casillar'){
ordenar.textContent = 'Listar';
document.querySelector('.container-products').classList.remove('list');
document.querySelector('.container-products').classList.add('grid');
}
});