function addStore() {
    const form = document.querySelector('form');
    form.classList.add('addStore');

    const inputName = document.createElement('input');
    const inputUrl = document.createElement('input');
    const inputDistrict = document.createElement('input');
    const inputIndustry = document.createElement('input');

    const submit = document.createElement('button');

    inputName.placeholder = 'Name of the store';
    inputUrl.placeholder = 'URL of the store';
    inputDistrict.placeholder = 'city district';
    inputIndustry.placeholder = 'industry';
    submitButton.innerText = 'Add store';

    submitButton.addEventListener('click', () => {
        const store = {
            name: inputName.value,
            url: inputUrl.value,
            district: inputDistrict.value,
            industry: inputIndustry.value
        };

        fetch('/addStore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(store)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createStores('/stores');
        });
    });
}
