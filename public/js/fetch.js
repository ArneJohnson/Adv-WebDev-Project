var filterStatus = false;

function createStores(apiEndpoint) {
    const storesList = document.getElementById('storesList');
    storesList.innerHTML = '';

    fetch('http://localhost:3001' + apiEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(stores => {
            if (stores.length === 0) {
                storesList.innerHTML = '<p>No stores available</p>';
            } else {
                stores.forEach(store => {
                    const listItem = document.createElement('div');
                    listItem.classList.add('store-item');
                    listItem.innerHTML = `
                        <h3>${store.name}</h3>
                        <p>District: ${store.district}</p>
                        <p>Industry: ${store.industry}</p>
                        <p><a href="https://www.${store.url}/" target="_blank">Visit Store</a></p>
                        <button class="update-button" data-id="${store.id}">Update</button>
                        <button class="delete-button" data-id="${store.id}">Delete</button>
                    `;
                    storesList.appendChild(listItem);
                });

                attachButtonListeners();
            }
        })
        .catch(error => {
            console.error('Error fetching stores:', error);
            storesList.innerHTML = '<p>Failed to load stores. Please try again later.</p>';
        });
}

function attachButtonListeners() {
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const storeId = event.target.dataset.id;
            deleteStore(storeId);
        });
    });

    const updateButtons = document.querySelectorAll('.update-button');
    updateButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const storeId = event.target.dataset.id;
            window.location.href = `/updateStore.html?id=${storeId}`;
        });
    });
}

function deleteStore(storeId) {
    fetch(`/api/store?id=${storeId}`, {
        method: 'DELETE',
    })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            createStores('/api/stores');
        })
        .catch(error => {
            console.error('Error deleting store:', error);
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
            createStores('/api/storesFiltered');
        } else {
            createStores('/api/stores');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    createButton();
    createStores('/api/stores');
});