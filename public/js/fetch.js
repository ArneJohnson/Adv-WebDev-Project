var filterStatus = false;

function createStores(apiEndpoint) {
    const storesList = document.getElementById('storesList');
    storesList.innerHTML = '';

    fetch(apiEndpoint)
        .then(response => response.json())
        .then(stores => {
            if (stores.length === 0) {
                console.log('Stores fetched:', stores);
                storesList.innerHTML = '<li>No stores available</li>';
            } else {
                stores.forEach(store => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('store-item');
                    listItem.innerHTML = `
                        <h3>${store.name}</h3>
                        <p>District: ${store.district}</p>
                        <p>Industry: ${store.industry}</p>
                        <p><a href="${store.url}" target="_blank">Visit Store</a></p>
                    `;
                    storesList.appendChild(listItem);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching stores:', error);
            storesList.innerHTML = '<li>Failed to load stores</li>';
        });
}

function createButton() {
    const filter = document.querySelector('.filter');
    const button = document.createElement('button');

    filter.appendChild(button);
    button.innerText = 'District';

    button.addEventListener('click', () => {
        filterStatus = !filterStatus;

        const storesList = document.querySelector('#storesList');
        storesList.innerHTML = '';

        if (filterStatus) {
            createStores('/storesFiltered');
        } else {
            createStores('/stores');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createButton();
    createStores('/stores');
});
