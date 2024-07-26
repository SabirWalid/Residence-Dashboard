document.addEventListener('DOMContentLoaded', async() => {
    const menu = document.getElementsByClassName('menu')[0];
    const navigation = document.getElementsByClassName('sidenav')[0];
    const closeIcon = document.querySelector('.close-fill');
    const searchWord = document.querySelector('.search-input');
    const toggleMode = document.querySelector('.toogle-mode');
    const notificationsPanel = document.querySelector('.notifications');
    const notificationsList = document.querySelector('.notifications-list');
    const maintenanceTableBody = document.getElementById('maintenance-table-body');
    const API_URL = 'https://669a46459ba098ed61ff0909.mockapi.io/api/request/maintenances';
    const API_URL_NOTIFICATIONS = 'https://669a46459ba098ed61ff0909.mockapi.io/api/request/notifications';
    if (menu) {
        menu.addEventListener('click', (e) => {
            e.preventDefault();
            navigation.style.display = 'block';
        });
    }
    if (closeIcon) {
        closeIcon.addEventListener('click', (e) => {
            e.preventDefault();
            navigation.style.display = 'none';
        });
    }
    if (searchWord) {
        searchWord.addEventListener('focus', (e) => {
            e.preventDefault();
            searchWord.style.border = 'none';
            searchWord.style.borderBottom = '1px solid #000';
        });
    }
    if (toggleMode) {
        toggleMode.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.classList.toggle('dark-mode');
            if (navigation) {
                navigation.classList.toggle('dark-mode-sidenav');
            }
        });
    }
    if (notificationsPanel && notificationsList) {
        notificationsPanel.addEventListener('click', async(e) => {
            e.preventDefault();
            notificationsList.style.display = notificationsList.style.display === 'block' ? 'none' : 'block';
            try {
                const response = await fetch(API_URL_NOTIFICATIONS);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                notificationsList.innerHTML = '';
                data.forEach(item => {
                    const nots = document.createElement('div');
                    nots.classList.add('notification-item');
                    nots.innerHTML = `
                        <p>${item.sender}</p>
                        <p>${item.notifications}</p>
                        <strong>${new Date(item.createdAt).toLocaleString()}</strong>
                    `;
                    notificationsList.appendChild(nots);
                });
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        });
    }
    const fetchData = async() => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    const populateTable = (data) => {
        if (maintenanceTableBody) {
            maintenanceTableBody.innerHTML = '';
            data.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.roomNumber}</td>
                    <td>${new Date(item.requestDate).toLocaleDateString()}</td>
                    <td>${item.issueDescription}</td>
                    <td>${item.status}</td>
                    <td>${item.priority ? 'Yes' : 'No'}</td>
                    <td>${item.notes}</td>
                `;
                maintenanceTableBody.appendChild(row);
            });
        }
    };

    const maintenanceData = await fetchData();
    populateTable(maintenanceData);
});