// Load orders from localStorage
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const customers = JSON.parse(localStorage.getItem("customers")) || [];

const collapseBtn = document.getElementById('collapseBtn'); 

collapseBtn.addEventListener('click', e=>{
  e.preventDefault();
  const aside = collapseBtn.closest('aside');
  aside.classList.add("hidden");
  const main = document.querySelector('main');
  const h1 = main.querySelector('h1');
  const showSideBarBtn = document.createElement('button');
  showSideBarBtn.id = "showSideBarBtn"; 
  showSideBarBtn.textContent = "→";
  showSideBarBtn.className ="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 transition text-gray-600 font-semibold">
  showSideBarBtn.addEventListener('click', e=>{
    e.preventDefault();
    aside.classList.remove("hidden");
    showSideBarBtn.remove();
  })
  main.insertBefore(showSideBarBtn, h1);

})


// Group orders by customer
let customersMap = {};

const container = document.getElementById("customersContainer");

//you can add order product taken by the customer and quantities of each, and other social media links
orders.forEach(order => {
  const products = order.products.map(productObj => Object.entries(productObj)); //assuming 3 products per order: products is [[[product, macbook],[quantity,2]],[[product, mercuriel],[quantity,6]],[[product, book],[quantity,3]]]
  let customerProducts = products.map(product => `${product[0][1]} (${product[1][1]})`).join(", ");
  const key = order.cid; //customer Id
  if (key.state == "new") {
    customersMap[key.value] = {
      name: order.customer,
      status: "new",
      products: customerProducts,
      phone: order.phone,
      city: order.city,
      address: order.address,
      totalOrders: 0,
      receivedOrders: 0,
      spent: 0
    };
    customersMap[key.value].totalOrders += 1;
    // Only confirmed, delivered or shipped orders count for received orders and spending
    if (order.status === "Confirmed") {
      customersMap[key.value].receivedOrders += 1;
      customersMap[key.value].spent += Number(order.price) || 0;
    }
    if (!customers.some(c => c.name === customersMap[key.value].name && c.phone === customersMap[key.value].phone)){ //since include method compares by reference in case of compounded data type (object), we use some method to divide-and-conquer, compare primitive data type (forming composite key) by value, and then aggregate boolean value
      customers.push(customersMap[key.value]);
    }

  } else {
    customersMap[key.value] = {...customersMap[key.value], status:"returned"};
    const newCustomerProducts = customersMap[key.value]?.products + ", " + customerProducts;
    customersMap[key.value] = {...customersMap[key.value], products:newCustomerProducts};
    customersMap[key.value].totalOrders += 1;
    // Only confirmed, delivered or shipped orders count for received orders and spending
    if (order.status === "Confirmed") {
      customersMap[key.value].receivedOrders += 1;
      customersMap[key.value].spent += Number(order.price) || 0;
    }
    customers.forEach(c => { //using forEach for reference
      if(c.name === customersMap[key.value].name && c.phone === customersMap[key.value].phone){
        c = customersMap[key.value]; 
      }
    })

  }

});

localStorage.setItem("customers", JSON.stringify(customers)); 

// Convert map to array and sort by totalOrders descending
let customersArray = Object.values(customersMap).sort((a,b)=> b.totalOrders - a.totalOrders);

// Assign ranks based on totalOrders
customersArray = customersArray.map((customer, index) => {
  let rank = "Low";
  if (customer.totalOrders >= 5) rank = "Top";
  else if (customer.totalOrders >= 2) rank = "Medium";
  return {...customer, rank};
});

// Render customer cards
if (orders.length === 0){
  container.innerHTML = `
  <div class="col-span-full flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow">
    
    <svg xmlns="http://www.w3.org/2000/svg" 
      class="w-16 h-16 text-gray-300 mb-4"
      fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
        d="M17 20h5V4H2v16h5m10 0v-6a3 3 0 00-6 0v6m6 0H7"/>
    </svg>

    <h2 class="text-xl font-semibold text-gray-700 mb-2">
      No Customers Yet
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
} else {
  container.innerHTML = customersArray.map(c => `
    <div class="bg-white p-6 rounded-xl shadow hover:shadow-xl transition">
      <div class="flex justify-between items-center mb-3">
        <h2 class="font-semibold text-lg">${c.name}</h2>
        <span class="px-2 py-1 rounded-full text-xs font-semibold ${
          c.rank === "Top" ? "bg-green-100 text-green-800" :
          c.rank === "Medium" ? "bg-yellow-100 text-yellow-800" :
          "bg-gray-100 text-gray-800"
        }">${c.rank}</span>
      </div>
      <p class="text-gray-500 text-sm"><span class="font-medium">Status:</span> ${c.status}</p>
      <p class="text-gray-500 text-sm"><span class="font-medium">Products:</span> ${c.products}</p>
      <p class="text-gray-500 text-sm"><span class="font-medium">Total Orders:</span> ${c.totalOrders}</p>
      <p class="text-gray-500 text-sm"><span class="font-medium">Received Orders:</span> ${c.receivedOrders}</p>
      <p class="text-gray-500 text-sm"><span class="font-medium">Spent:</span> ${c.spent} DH</p>
      <p class="text-gray-500 text-sm"><span class="font-medium">Phone:</span> ${c.phone}</p>
      <p class="text-gray-500 text-sm"><span class="font-medium">City:</span> ${c.city}</p>
      <p class="text-gray-500 text-sm"><span class="font-medium">Address:</span> ${c.address}</p>
      <a href="https://api.whatsapp.com/send?phone=${c.phone}" target="_blank" 
      class="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 32 32" fill="currentColor">
          <path d="M16 2C8.27 2 2 8.27 2 16c0 2.78.73 5.36 2 7.65L2 30l6.35-2c2.29 1.27 4.87 2 7.65 2 7.73 0 14-6.27 14-14S23.73 2 16 2zm7.43 20.44c-.3.84-1.67 1.59-2.31 1.7-.61.11-1.37.15-3.02-.44-3.1-.92-5.13-3.38-5.28-3.53-.15-.15-2.63-2.88-2.63-5.52 0-2.64 1.32-3.95 1.79-4.47.47-.52 1.03-.61 1.37-.61.35 0 .66.01.95.01.31.01.67-.11 1.05.8.37.91 1.26 3.14 1.37 3.37.11.23.18.51.04.82-.13.31-.2.5-.39.77-.2.27-.41.61-.57.82-.16.21-.33.44-.15.85.18.42.79 1.39 1.7 2.26 1.17 1.13 2.14 1.44 2.45 1.6.31.16.5.14.68-.09.18-.23.77-.9.97-1.21.2-.31.42-.26.7-.16.28.1 1.79.84 2.1.99.31.15.52.22.6.34.08.12.08.7-.22 1.54z"/>
      </svg>
        WhatsApp
      </a>  
    </div>
  `).join("");
}