// Add Expense Handling
const form = document.querySelector("form");
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseId = JSON.parse(localStorage.getItem("expenseId")) || 1;

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("expenseId", JSON.stringify(expenseId));
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameInput = form.querySelector("input[placeholder='Expense name']");
  const amountInput = form.querySelector("input[type='number']");
  const categorySelect = form.querySelector("select");

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;

  if (!name || isNaN(amount)) {
    Swal.fire({
      icon: "warning",
      title: "Invalid input",
      text: "Please enter a valid name and amount",
    });
    return;
  }
  const data = {
    id: expenseId,
    name:name,
    amount:amount,
    category:category 
  };
  expenses.push(data);
  expenseId++;
  saveExpenses();

  Swal.fire({
    icon: "success",
    title: "Added!",
    text: "Expense has been added.",
    timer: 1500,
    showConfirmButton: false
  });

  // Clear form
  nameInput.value = "";
  amountInput.value = "";
  categorySelect.selectedIndex = 0;

  Swal.fire({
    icon: "success",
    title: "Add",
    text: "Expense Added!",
    timer: 2000,
    timerProgressBar: true
  });

  setTimeout(()=>{
    window.location.href = './expenses.html';
  }, 3000)

});