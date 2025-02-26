async function addStore() {
    const form = document.getElementById('addStoreForm');
    const inputName = document.getElementById('add-name');
    const inputUrl = document.getElementById('add-url');
    const inputDistrict = document.getElementById('add-district');
    const inputIndustry = document.getElementById('add-industry');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const store = {
            name: inputName.value,
            url: inputUrl.value,
            district: inputDistrict.value,
            industry: inputIndustry.value
        };

        try {
            const response = await fetch('/addStore', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(store)
            });

            const data = await response.json();
            console.log(data);

            if (data.message === 'New store was added') {
                window.location.href = '/';
            }

        } catch (error) {
            console.error('Error:', error);
        }
    });
}

document.addEventListener('DOMContentLoaded', addStore);
