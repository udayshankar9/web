document.addEventListener('DOMContentLoaded', () => {
    
    const expenseForm = document.getElementById('expense-form');
    const expenseList = document.getElementById('expense-list');
    const ctx = document.getElementById('expenseChart').getContext('2d');
    let myChart; // Variable to hold the chart instance

    // Initialize with data from localStorage or an empty array
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Saves the current expenses array to localStorage
    function saveExpenses() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    // Creates and adds a new expense item to the UI
    function addExpenseToUI(expense) {
        const listItem = document.createElement('li');
        listItem.classList.add('expense-item');
        // Add a data-id attribute to uniquely identify the expense
        listItem.setAttribute('data-id', expense.id);
        
        listItem.innerHTML = `
            <div class="expense-details">
                <span class="expense-description">${expense.description}</span>
                <span class="expense-category">${expense.category}</span>
            </div>
            <div class="expense-action">
                <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
                <button class="delete-btn" title="Delete Expense">&times;</button>
            </div>
        `;
        expenseList.appendChild(listItem);
    }

    // Renders all expenses from the expenses array to the UI
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => addExpenseToUI(expense));
        updateChart(); // Update the chart whenever expenses are rendered
    }

    // --- CHART LOGIC ---
    function updateChart() {
        // Aggregate expenses by category
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        if (myChart) {
            myChart.destroy();
        }

        myChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Expenses by Category',
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    // Event listener for form submission
    expenseForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newExpense = {
            id: Date.now(),
            description: document.getElementById('description').value,
            amount: parseFloat(document.getElementById('amount').value),
            category: document.getElementById('category').value
        };
        
        expenses.push(newExpense);
        saveExpenses();
        renderExpenses(); // Re-render the list and chart
        
        expenseForm.reset();
    });

    // --- NEW EVENT LISTENER FOR DELETING EXPENSES ---
    expenseList.addEventListener('click', (event) => {
        // Check if the clicked element is a delete button
        if (event.target.classList.contains('delete-btn')) {
            // Find the closest parent 'li' element to get its ID
            const listItem = event.target.closest('.expense-item');
            const expenseId = Number(listItem.dataset.id);

            // Filter the expenses array, removing the expense with the matching ID
            expenses = expenses.filter(expense => expense.id !== expenseId);

            // Save the updated array and re-render the UI
            saveExpenses();
            renderExpenses();
        }
    });

    // Initial load
    renderExpenses();
});
