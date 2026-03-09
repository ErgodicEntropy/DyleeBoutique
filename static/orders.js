let orders = JSON.parse(localStorage.getItem("orders")) || [];
let orderId = JSON.parse(localStorage.getItem("orderId")) || 0;
let products = JSON.parse(localStorage.getItem("products") || []);

const orderBody = document.getElementById("orderBody");
const cardDiv = document.getElementById("cardDiv");
const tableDiv = document.getElementById("tableDiv");

const tableBtn = document.getElementById("tableBtn");
const cardBtn = document.getElementById("cardBtn");

const downloadBtn = document.getElementById("downloadBtn");
const exportBtn = document.getElementById("exportBtn");

function saveProducts(){
  localStorage.setItem("products", JSON.stringify(products));
}

function findOrderProduct(productName){//find the product object associated with the current order
  for (let key = 0; key < products.length; key++){
    if (products[key].name == productName){
      return products[key];
    }
  }
  return null; 
}

function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("orderId", JSON.stringify(orderId));
}

function renderTable() {
  orderBody.innerHTML = "";

  if (orders.length === 0){
    orderBody.innerHTML = `
      <tr>
      <td colspan="9" class="p-6 text-center text-gray-500">
      No orders yet
      </td>
      </tr>
    `;

    return;
  }

  orders.forEach(order => {
    const productName = order.product;
    const product = findOrderProduct(productName);
    let priceClass = "p-4 font-semibold text-green-600";
    let priceMessage = "Good margin"; 
    if (Number(order.price)/Number(order.quantity) < Number(product.price)){ //if the price of your order is lower than the product's estimated price (minimum selling price)
      priceClass = "p-4 font-semibold text-red-600"; //indicates financial loss or risk
      priceMessage = "Price below minimum selling price (risk)";
    }
    let statusClass;

    switch(order.status){
      case "Confirmed":
        statusClass = "bg-green-100 text-green-700";
        break;
      case "Pending":
        statusClass = "bg-yellow-100 text-yellow-700";
        break;
      case "Canceled":
        statusClass = "bg-red-100 text-red-600"
        break;
      default:
        statusClass = "bg-yellow-100 text-yellow-700";
    }

    const toggleText = order.status === "Confirmed" ? "Unconfirm" : "Confirm";

    orderBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr class="border-t hover:bg-gray-50 transition">
        <td class="p-4 font-medium text-gray-700">${order.id}</td>
        <td class="p-4 font-semibold text-gray-800">${order.customer}</td>
        <td class="p-4 text-gray-600">${order.phone}</td>
        <td class="p-4 text-gray-500">${order.date}</td>
        <td class="p-4 text-gray-700">${order.product}</td>
        <td class="p-4 text-gray-700">${order.quantity}</td>
        <td class="${priceClass}" title="${priceMessage}">${order.price}DH</td>
        <td class="p-4 text-gray-600">${order.city}</td>
        <td class="p-4 text-gray-600">${order.address}</td>
        <td class="p-4">
          <span class="text-xs font-semibold px-3 py-1 rounded-full ${statusClass}">
            ${order.status}
          </span>
        </td>
        <td class="p-4 flex flex-wrap gap-2">
          <button data-id="${order.id}"
            class="confirmBtn text-white ${
              order.status === "Confirmed"
                ? "bg-yellow-400 hover:bg-yellow-500"
                : "bg-green-400 hover:bg-green-500"
            } text-xs font-medium rounded-lg px-3 py-1.5 transition"
          >
            ${toggleText}
          </button>

          <button data-id="${order.id}"
            class="editBtn text-white bg-gradient-to-r from-blue-400 to-blue-600 hover:bg-gradient-to-br focus:ring-2 focus:ring-blue-300 font-medium rounded-lg text-xs px-3 py-1.5 transition">
            Edit
          </button>

          <button data-id="${order.id}"
            class="deleteBtn text-white bg-red-600 hover:bg-gradient-to-br focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 transition">
            Delete
          </button>

          <button data-id="${order.id}"
            class="cancelBtn text-white bg-gradient-to-r from-red-400 to-red-600 hover:bg-gradient-to-br focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5 transition">
            Cancel
          </button>

        </td>
      </tr>
    `
    );
  });
}

function renderCards() {
  cardDiv.innerHTML = "";

  if (orders.length === 0){
    cardDiv.innerHTML = `
    <div class="col-span-full text-center p-10 bg-white rounded-xl shadow">
    No orders yet
    </div>
    `;

    return;
  }


  orders.forEach(order => {
    const statusClass =
      order.status === "Confirmed"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700";

    const toggleText = order.status === "Confirmed" ? "Unconfirm" : "Confirm";

    cardDiv.insertAdjacentHTML(
      "beforeend",
      `
      <div class="bg-white rounded-xl shadow-lg p-5 space-y-3 hover:shadow-xl transition-shadow">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800">${order.customer}</h2>
          <span class="text-xs font-semibold px-3 py-1 rounded-full ${statusClass}">${order.status}</span>
        </div>
        <div class="space-y-1 text-sm text-gray-600">
          <p><span class="font-medium text-gray-700">Product:</span> ${order.product}</p>
          <p><span class="font-medium text-gray-700">Price:</span> ${order.price}DH</p>
          <p><span class="font-medium text-gray-700">City:</span> ${order.city}</p>
          <p><span class="font-medium text-gray-700">Phone:</span> ${order.phone}</p>
        </div>
        <div class="flex justify-between pt-3 border-t">
          <button data-id="${order.id}" class="confirmBtn text-sm font-medium ${
            order.status === "Confirmed" ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"
          } transition">${toggleText}</button>
          <button data-id="${order.id}" class="editBtn text-sm font-medium text-blue-600 hover:text-blue-800 transition">Edit</button>
          <button data-id="${order.id}" class="deleteBtn text-sm font-medium text-orange-600 hover:text-red-800 transition">Delete</button>
          <button data-id="${order.id}" class="cancelBtn text-sm font-medium text-red-600 hover:text-red-800 transition">Cancel</button>
          </div>
      </div>
    `
    );
  });
}


// Event delegation for buttons
document.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  const index = orders.findIndex(o => o.id === id);

  if (e.target.classList.contains("deleteBtn")) {
    const productName = orders[index].product;
    const product = findOrderProduct(productName);

    if (product){
      product.stock += Number(orders[index].quantity); //product returned to the product list
      saveProducts(); 
    }
    orders.splice(index, 1);
    saveOrders();
    renderTable();
    renderCards();
  }

  if (e.target.classList.contains("cancelBtn")) {
    if (orders[index].status != "Canceled"){
      orders[index].status = "Canceled";
    }
    const productName = orders[index].product;
    const product = findOrderProduct(productName);
    if (product){
      product.stock += Number(orders[index].quantity); //product returned to the product list
      saveProducts(); 
    }
    saveOrders();
    renderTable();
    renderCards();
  }

  if (e.target.classList.contains("confirmBtn")) {
    // Toggle status
    orders[index].status =
      orders[index].status === "Confirmed" ? "Pending" : "Confirmed";
    saveOrders();
    renderTable();
    renderCards();
  }

  if (e.target.classList.contains("editBtn")) {
    const order = orders[index];

    Swal.fire({
      title: "Edit Order",
      html: `
        <input id="customer" class="swal2-input" value="${order.customer}">
        <input id="phone" class="swal2-input" value="${order.phone}">
        <input id="product" class="swal2-input" value="${order.product}">
        <input id="price" class="swal2-input" value="${order.price}">
        <input id="city" class="swal2-input" value="${order.city}">
        <input id="address" class="swal2-input" value="${order.address}">
      `,
      preConfirm: () => {
        order.customer = document.getElementById("customer").value;
        order.phone = document.getElementById("phone").value;
        order.product = document.getElementById("product").value;
        order.price = document.getElementById("price").value;
        order.city = document.getElementById("city").value;
        order.address = document.getElementById("address").value;
      }
    }).then(() => {
      saveOrders();
      renderTable();
      renderCards();
    });
  }
});

// Toggle between table and cards
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
  const blob = new Blob([JSON.stringify(orders, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.json";
  a.click();
  URL.revokeObjectURL(url);
};

// Export CSV
exportBtn.onclick = () => {
  const csv = [
    ["ID", "Customer", "Phone", "Date", "Product", "Price", "City", "Address", "Status"],
    ...orders.map(o => [o.id, o.customer, o.phone, o.date, o.product, o.price, o.city, o.address, o.status])
  ]
    .map(e => e.join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "orders.csv";
  a.click();
  URL.revokeObjectURL(url);
};

// Load manual order if exists
document.addEventListener("DOMContentLoaded", () => {
  const data = JSON.parse(localStorage.getItem("orderdata"));

  if (data) {
    orderId++;
    orders.push({
      id: orderId,
      customer: data.customer,
      phone: data.phone,
      product: data.product,
      quantity: data.quantity, 
      price: data.price,
      city: data.city,
      address: data.address,
      date: new Date().toISOString().slice(0, 10),
      status: "Pending"
    });

    saveOrders();
    localStorage.removeItem("orderdata");
  }

  renderTable();
});