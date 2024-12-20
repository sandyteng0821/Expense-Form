// variable settings
const transactionForm = document.getElementById("transactionForm");
const transactionTable = document.querySelector("#transactionTable tbody");
const downloadLink = document.getElementById("downloadSummary");

// Load transactions from localStorage or initialize an empty array
let transactions = localStorage.getItem('transactions')
  ? JSON.parse(localStorage.getItem('transactions'))
  : [];

// Render the transactions table on page load
function render() {
  // Clear the table before rendering
  transactionTable.innerHTML = "";

  // Loop over stored transactions and render them
  transactions.forEach(({id, name, amount, date }) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${amount.toFixed(2)}</td>
      <td>${new Date(date).toLocaleDateString()}</td>
      <button class="delete-btn" data-id="${id}" onclick="deleteTransaction(${id})">Delete</button>
    `;
    transactionTable.appendChild(row);
  });
}

// Add a single transaction and render it in the table
function addTransactionToTable({id, name, amount, date }) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${name}</td>
    <td>${amount.toFixed(2)}</td>
    <td>${new Date(date).toLocaleDateString()}</td>
    <button class="delete-btn" data-id="${id}" onclick="deleteTransaction(${id})">Delete</button>
  `;
  transactionTable.appendChild(row);
}

// Delete a transaction (find its id)
function deleteTransaction(id) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);
  // Save modified transactions
  localStorage.setItem("transactions", JSON.stringify(transactions));
  render();
}

// Download summary as a CSV file
downloadLink.addEventListener("click", () => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["Name,Amount,Date"]
      .concat(
        transactions.map(
          (t) => `${t.name},${t.amount},${new Date(t.date).toLocaleDateString()}`
        )
      )
      .join("\n");
  const encodeUri = encodeURI(csvContent);
  downloadLink.setAttribute("href", encodeUri);
  downloadLink.setAttribute("download", "transactions.csv");
});

// Add a new transaction when the form is submitted
transactionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("transactionName").value;
  const amount = parseFloat(document.getElementById("transactionAmount").value);
  const date = document.getElementById("transactionDate").value;
  const id = transactions.length + 1;

  // Validate the input
  if (!name || isNaN(amount) || amount <= 0 || !date) {
    alert("Please fill in all fields correctly. Amount must be a valid number.");
    return;
  }

  // Create a new transaction object
  const newTransaction = { id, name, amount, date };

  // Add it to the transactions array
  transactions.push(newTransaction);

  // Update localStorage
  localStorage.setItem("transactions", JSON.stringify(transactions));

  // Add the transaction to the table
  addTransactionToTable(newTransaction);

  // Reset the form
  transactionForm.reset();
});

// Initial render of the transactions table on page load
render();