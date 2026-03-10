// Load orders from localStorage
const orders = JSON.parse(localStorage.getItem("orders")) || [];
const customers = JSON.parse(localStorage.getItem("customers")) || [];
let customerCounter = JSON.parse(localStorage.getItem("customerCounter")) || 0; 

// Group orders by customer
let customersMap = {};

const container = document.getElementById("customersContainer");

//you can add order product taken by the customer and quantities of each, and other social media links
orders.forEach(order => {
  const key = order.cid; //customer Id
  if (!key) {
    customersMap[customerCounter] = {
      name: order.customer,
      status: "new",
      phone: order.phone,
      city: order.city,
      address: order.address,
      totalOrders: 0,
      receivedOrders: 0,
      spent: 0
    };
    customersMap[customerCounter].totalOrders += 1;
    // Only confirmed, delivered or shipped orders count for received orders and spending
    if (order.status === "Confirmed") {
      customersMap[customerCounter].receivedOrders += 1;
      customersMap[customerCounter].spent += Number(order.price) || 0;
    }
    if (!customers.includes(customersMap[customerCounter])){
      customers.push(customersMap[customerCounter]);
    }

    customerCounter++;
    localStorage.setItem("customerCounter", customerCounter);
  } else {
    customersMap[key] = {...customersMap[key], status:"returned"};
    customersMap[key].totalOrders += 1;
    // Only confirmed, delivered or shipped orders count for received orders and spending
    if (order.status === "Confirmed") {
      customersMap[key].receivedOrders += 1;
      customersMap[key].spent += Number(order.price) || 0;
    }
    if (!customers.includes(customersMap[key])){
      customers.push(customersMap[key]);
    }

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