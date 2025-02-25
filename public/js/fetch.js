var filterStatus = false;

function createButton() {
    const filter = document.querySelector('.filter');
    const button = document.createElement('button');

    filter.appendChild(button);
    button.innerText = 'District';

    button.addEventListener('click', () => {
        filterStatus = !filterStatus;

        const storelistUl = document.querySelector('#storelist');
        storelistUl.innerHTML = '';
        
        if (filterStatus == false) {
            createStores('/stores')
            
        } else {
            createStores('/storesFiltered')
        }
        fetchDistrict();
    });
}