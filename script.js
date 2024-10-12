document.addEventListener("DOMContentLoaded", () => {
    const apiUrl = 'https://cors-anywhere.herokuapp.com/https://s3.amazonaws.com/roxiler.com/product_transaction.json';
    const tableBody = document.getElementById('table_body');
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');
    const searchBox = document.getElementById('searchBox'); // Get the search box input element
    const monthDropdown = document.getElementById('monthDropdown'); // Month dropdown
    

    let currentPage = 1;
    const rowsPerPage = 10;
    let productData = [];
    let filteredData = []; // To hold the filtered data

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            productData = data;
            filteredData = productData; // Initially, filteredData is the same as productData
            displayTable(currentPage);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });



    // Function to display the table rows for the current page
    function displayTable(page) {
        tableBody.innerHTML = ''; // Clear the table body
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedItems = filteredData.slice(start, end); // Use filteredData for pagination

        paginatedItems.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <th scope="row">${start + index + 1}</th>
                <td>${product.title}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.category}</td>
                <td>${product.sold}</td>
                <td><img src="${product.image}" alt="${product.title}" style="width: 50px; height: auto;"></td>
            `;
            tableBody.appendChild(row);
        });

        prevButton.disabled = page === 1;
        nextButton.disabled = end >= filteredData.length;
    }

    // Add event listener for the search box
    searchBox.addEventListener('input', function () {
        const query = this.value.toLowerCase(); // Convert search query to lowercase
        // Filter the data based on the search query
        filteredData = productData.filter(product =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query)
        );

        currentPage = 1; // Reset to the first page after search
        displayTable(currentPage); // Display the filtered data
    });

    // Add event listener for Previous button
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayTable(currentPage);
        }
    });

    // Add event listener for Next button
    nextButton.addEventListener('click', () => {
        if (currentPage * rowsPerPage < filteredData.length) {
            currentPage++;
            displayTable(currentPage);
        }
    });
});
