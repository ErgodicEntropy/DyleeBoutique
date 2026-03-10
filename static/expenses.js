let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseId = JSON.parse(localStorage.getItem("expenseId")) || 0;
let products = JSON.parse(localStorage.getItem("products")) || [];

//product costs automatically factored
if (products && expenseId < products.length){
    products.forEach(product => {
        expenseId++;
        const expense = {
            id:expenseId, 
            name:product.name || "", 
            amount:Number(product.cost || 0)*Number(product.initialQuantity || 0), 
            category: "Product Purchase"
        }
        expenses.push(expense);
        saveExpenses();
    })
}
const expenseBody = document.getElementById("expenseBody");
const cardDiv = document.getElementById("cardDiv");
const tableDiv = document.getElementById("tableDiv");

const tableBtn = document.getElementById("tableBtn");
const cardBtn = document.getElementById("cardBtn");

const addExpenseBtn = document.getElementById("addExpenseBtn");
const downloadBtn = document.getElementById("downloadBtn");
const exportBtn = document.getElementById("exportBtn");

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("expenseId", JSON.stringify(expenseId));
}

// Render table
function renderTable() {
  expenseBody.innerHTML = "";

  if (expenses.length === 0) {
    expenseBody.innerHTML = `
      <tr>
        <td colspan="5" class="p-6 text-center text-gray-500">No expenses yet</td>
      </tr>
    `;
    return;
  }

  expenses.forEach(exp => {
    expenseBody.insertAdjacentHTML("beforeend", `
      <tr class="border-t hover:bg-gray-50 transition">
        <td class="p-4 font-medium">${exp.id}</td>
        <td class="p-4 font-semibold">${exp.name}</td>
        <td class="p-4 font-semibold">${exp.amount} DH</td>
        <td class="p-4">${exp.category}</td>
        <td class="p-4 flex gap-2">
          <button data-id="${exp.id}" class="editBtn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Edit</button>
          <button data-id="${exp.id}" class="deleteBtn bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
        </td>
      </tr>
    `);
  });
}

// Render cards
function renderCards() {
  cardDiv.innerHTML = "";

  if (expenses.length === 0) {
    cardDiv.innerHTML = `
      <div class="col-span-full p-6 text-center text-gray-500 bg-white rounded-xl shadow">
        No expenses yet
      </div>
    `;
    return;
  }

  expenses.forEach(exp => {
    cardDiv.insertAdjacentHTML("beforeend", `
      <div class="bg-white rounded-xl shadow-lg p-5 space-y-3 hover:shadow-xl transition">
        <h2 class="text-lg font-semibold text-gray-800">${exp.name}</h2>
        <p class="text-gray-700 font-medium">${exp.amount} DH</p>
        <p class="text-gray-600">${exp.category}</p>
        <div class="flex gap-2">
          <button data-id="${exp.id}" class="editBtn text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">Edit</button>
          <button data-id="${exp.id}" class="deleteBtn text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">Delete</button>
        </div>
      </div>
    `);
  });
}

// Add / Edit / Delete event delegation
document.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  const index = expenses.findIndex(exp => exp.id === id);

  if (e.target.classList.contains("deleteBtn")) {
    expenseId--;
    expenses.splice(index, 1);
    saveExpenses();
    renderTable();
    renderCards();
  }

  if (e.target.classList.contains("editBtn")) {
    const exp = expenses[index];

    Swal.fire({
      title: "Edit Expense",
      html: `
        <input id="name" class="swal2-input" value="${exp.name}">
        <input id="amount" type="number" class="swal2-input" value="${exp.amount}">
        <select id="category" class="swal2-input">
          <option ${exp.category === 'Shipping' ? 'selected' : ''}>Shipping</option>
          <option ${exp.category === 'Ads' ? 'selected' : ''}>Ads</option>
          <option ${exp.category === 'Supplies' ? 'selected' : ''}>Supplies</option>
        </select>
      `,
      preConfirm: () => {
        exp.name = document.getElementById("name").value;
        exp.amount = parseFloat(document.getElementById("amount").value);
        exp.category = document.getElementById("category").value;
      }
    }).then(() => {
      saveExpenses();
      renderTable();
      renderCards();
    });
  }
});

// Toggle views
tableBtn.onclick = () => {
  tableDiv.classList.remove("hidden");
  cardDiv.classList.add("hidden");
};

cardBtn.onclick = () => {
  renderCards();
  cardDiv.classList.remove("hidden");
  tableDiv.classList.add("hidden");
};

// Download JSON
downloadBtn.onclick = () => {
  const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.json";
  a.click();
  URL.revokeObjectURL(a.href);
};

// Export CSV
exportBtn.onclick = () => {
  const csv = [
    ["ID", "Name", "Amount", "Category"],
    ...expenses.map(exp => [exp.id, exp.name, exp.amount, exp.category])
  ]
    .map(row => row.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(a.href);
};

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  console.log(expenses);
  renderTable();
});