let orders = JSON.parse(localStorage.getItem("orders")) || [];
let orderId = JSON.parse(localStorage.getItem("orderId")) || 1;
let products = JSON.parse(localStorage.getItem("products")) || [];
let customers = JSON.parse(localStorage.getItem("customers")) || [];
let customerId = JSON.parse(localStorage.getItem("customerId")) || 1; 

const tableDiv = document.getElementById("tableDiv");
const orderHead = document.getElementById("orderHead");
const orderBody = document.getElementById("orderBody");
const cardDiv = document.getElementById("cardDiv");

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
    <div class="col-span-full flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow">
    
      <svg xmlns="http://www.w3.org/2000/svg" 
        class="w-16 h-16 text-gray-300 mb-4"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M17 20h5V4H2v16h5m10 0v-6a3 3 0 00-6 0v6m6 0H7"/>
      </svg>

      <h2 class="text-xl font-semibold text-gray-700 mb-2">
        No Orders Yet
      </h2>

      <p class="text-gray-500 text-sm mb-5 max-w-sm">
        When customers place their first orders, they will appear here with their order history and details.
      </p>

      <a href="add_order.html"
        class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition">
        Create First Order
      </a>

    </div>
    `;

    return;
  } else {
    orderHead.innerHTML = `
        <tr>
        <th class="p-4">ID</th>
        <th class="p-4">Customer</th>
        <th class="p-4">Phone</th>
        <th class="p-4">Date</th>
        <th class="p-4">Products</th>
        <th class="p-4">Total Quantity</th>
        <th class="p-4">Total Price</th>
        <th class="p-4">City</th>
        <th class="p-4">Address</th>
        <th class="p-4">Status</th>
        <th class="p-4">Action</th>
        </tr>`;    
  }

  orders.forEach(order => {
    const selectedProducts = order.products; //selected products of the current order
    console.log(selectedProducts);
    let totalQuantity = 0; 
    let productCostSum = 0;
    selectedProducts.forEach(item =>{
      const productName = item.product;
      const product = findOrderProduct(productName);
      productCostSum += Number(item.quantity)*Number(product.cost);
      totalQuantity += Number(item.quantity); 
    })
    let priceClass = "p-4 font-semibold text-green-600";
    let priceMessage = "Good margin"; 
    if (Number(order.price) < productCostSum){ //if the price of your order is lower than the sum of its products costs (or product cost if it's 1-1) 
        priceClass = "p-4 font-semibold text-red-600"; //indicates financial loss or risk
        priceMessage = "Price below minimum selling price (risk)";
    }

    // const productName = order.product;
    // const product = findOrderProduct(productName);
    // let priceClass = "p-4 font-semibold text-green-600";
    // let priceMessage = "Good margin"; 
    // if (Number(order.price)/Number(order.quantity) < Number(product.price)){ //if the price of your order is lower than the product's estimated price (minimum selling price)
    //   priceClass = "p-4 font-semibold text-red-600"; //indicates financial loss or risk
    //   priceMessage = "Price below minimum selling price (risk)";
    // }
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

    const toggleConfirm = order.status === "Canceled" ? "Uncancel": "Cancel";

    orderBody.insertAdjacentHTML(
      "beforeend",
      `
      <tr class="border-t hover:bg-gray-50 transition">
        <td class="p-4 font-medium text-gray-700">${order.id}</td>
        <td class="p-4 font-semibold text-gray-800">${order.customer}</td>
        <td class="p-4 text-gray-600">${order.phone}</td>
        <td class="p-4 text-gray-500">${order.date}</td>
        <td class="p-4 text-gray-700">
          ${selectedProducts.map(item => `${item.product} (${item.quantity})`).join(", ")}
        </td>
        <td class="p-4 text-gray-700">${totalQuantity}</td>
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
            class="cancelBtn text-white ${order.status === "Canceled" ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:bg-gradient-to-br focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5":"bg-gradient-to-r from-red-400 to-red-600 hover:bg-gradient-to-br focus:ring-2 focus:ring-red-300 font-medium rounded-lg text-xs px-3 py-1.5"} transition">
            ${toggleConfirm}
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
    const selectedProducts = order.products; //selected products of the current order
    console.log(selectedProducts);
    let totalQuantity = 0; 
    let productCostSum = 0;
    selectedProducts.forEach(item =>{
      const productName = item.product;
      const product = findOrderProduct(productName);
      productCostSum += Number(item.quantity)*Number(product.cost);
      totalQuantity += Number(item.quantity); 
    })
    let priceClass = "font-medium text-green-600";
    let priceMessage = "Good margin"; 
    if (Number(order.price) < productCostSum){ //if the price of your order is lower than the sum of its products costs (or product cost if it's 1-1) 
        priceClass = "font-medium text-red-600"; //indicates financial loss or risk
        priceMessage = "Price below minimum selling price (risk)";
    }

    const statusClass =
      order.status === "Confirmed"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700";

    const toggleText = order.status === "Confirmed" ? "Unconfirm" : "Confirm";

    const toggleConfirm = order.status === "Canceled" ? "Uncancel": "Cancel";

    cardDiv.insertAdjacentHTML(
      "beforeend",
      `
      <div class="bg-white rounded-xl shadow-lg p-5 space-y-3 hover:shadow-xl transition-shadow">
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-800">${order.customer}</h2>
          <span class="text-xs font-semibold px-3 py-1 rounded-full ${statusClass}">${order.status}</span>
        </div>
        <div class="space-y-1 text-sm text-gray-600">
          <p><span class="font-medium text-gray-700">Products:</span>
            ${selectedProducts.map(item => `${item.product} (${item.quantity})`).join(", ")}
          </p>
          <p><span class="font-medium text-gray-700">Total Quantity:</span> ${totalQuantity}</p>
          <p><span class="font-medium text-gray-700">Price:</span><span class="${priceClass}" title="${priceMessage}"> ${order.price}DH</span></p>
          <p><span class="font-medium text-gray-700">City:</span> ${order.city}</p>
          <p><span class="font-medium text-gray-700">Phone:</span> ${order.phone}</p>
          <p><span class="font-medium text-gray-700">Date:</span> ${order.date}</p>
          </div>
        <div class="flex justify-between pt-3 border-t">
          <button data-id="${order.id}" class="confirmBtn text-sm font-medium ${
            order.status === "Confirmed" ? "text-yellow-600 hover:text-yellow-800" : "text-green-600 hover:text-green-800"
          } transition">${toggleText}</button>
          <button data-id="${order.id}" class="editBtn text-sm font-medium text-blue-600 hover:text-blue-800 transition">Edit</button>
          <button data-id="${order.id}" class="deleteBtn text-sm font-medium text-orange-600 hover:text-red-800 transition">Delete</button>
          <button data-id="${order.id}" class="cancelBtn text-sm font-medium ${order.status === "Canceled" ? "text-yellow-600 hover:text-yellow-800":"text-red-600 hover:text-red-800"} transition">${toggleConfirm}</button>
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
      const selectedProducts = orders[index].products;
      selectedProducts.forEach(item => {
        const productObj = findOrderProduct(item.product);
        if (productObj){
          productObj.stock += Number(item.quantity);
        }
      });
      saveProducts(); 
      if (orderId > 0) orderId--;
      const customerIndex = customers.findIndex(c => c.name === orders[index].customer && c.phone === orders[index].phone);
      customers.splice(customerIndex,1);
      localStorage.setItem("customers", JSON.stringify(customers)); 
      if (customerId > 0) customerId--; 
    // const productName = orders[index].product;
    // const product = findOrderProduct(productName);

    // if (product){
    //   product.stock += Number(orders[index].quantity); //product returned to the product list
    //   saveProducts(); 
    // }
    orders.splice(index, 1);
    saveOrders();
    renderTable();
    renderCards();
  }

  if (e.target.classList.contains("cancelBtn")) {
    // Toggle status
    orders[index].status =
      orders[index].status === "Canceled" ? "Pending" : "Canceled";

    console.log(orders[index].status);
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
    //edge case: if the user edits an order so that it has the same customer (full name) and phone (number) as (accidentally) pre-existing order with the same pair values
    //in this case, this is subject to interpretation of the user intention: we can keep customers separate on My Customers, but we can also merge them. In case we merge them, here is how: 
    
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
    orders.push({
      id: orderId,
      cid: data.cid,
      customer: data.customer,
      phone: data.phone,
      products: data.products,
      price: data.price,
      city: data.city,
      address: data.address,
      date: new Date().toISOString().slice(0, 10),
      status: "Pending"
    });
    orderId++;

  // if (data) {
  //   orderId++;
  //   orders.push({
  //     id: orderId,
  //     customer: data.customer,
  //     phone: data.phone,
  //     product: data.product,
  //     quantity: data.quantity, 
  //     price: data.price,
  //     city: data.city,
  //     address: data.address,
  //     date: new Date().toISOString().slice(0, 10),
  //     status: "Pending"
  //   });

    saveOrders();
    localStorage.removeItem("orderdata");
  }

  renderTable();
});