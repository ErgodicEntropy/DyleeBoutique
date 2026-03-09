function findOrderProduct(productName){//find the product object associated with the current order
  for (let key = 0; key < products.length; key++){
    if (products[key].name == productName){
      return products[key];
    }
  }
  return null; 
}

function computeCityPercentages(orders) {
  const counts = {};
  const total = orders.length;

  // Count orders per city
  orders.forEach(order => {
    const city = order.city;

    if (!counts[city]) {
      counts[city] = 0;
    }

    counts[city]++;
  });

  // Convert counts to percentages
  const percentages = {};

  for (const city in counts) {
    percentages[city] = ((counts[city] / total) * 100).toFixed(2);
  }

  return percentages;
}

document.addEventListener("DOMContentLoaded", () => {

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === "Confirmed"); // Delivered = Confirmed = Shipped = Received
  const pendingOrders = orders.filter(o => o.status === "Pending");
  const canceledOrders = orders.filter(o => o.status === "Canceled");

  // Revenue & Expenses
  const revenue = deliveredOrders.reduce((sum,o)=>sum+Number(o.price||0),0);

  const expensesTotal = expenses.reduce((sum,e)=>sum+Number(e.amount||0),0)
  const profit = revenue - expensesTotal;

  const deliveredRate = totalOrders === 0 ? 0 : ((deliveredOrders.length / totalOrders) * 100).toFixed(2);
  const pendingRate = totalOrders === 0 ? 0 : ((pendingOrders.length / totalOrders) * 100).toFixed(2);
  const canceledRate = totalOrders === 0 ? 0 : ((canceledOrders.length / totalOrders) * 100).toFixed(2);
  const successRate = (deliveredRate - canceledRate).toFixed(2);

  // Update metrics
  document.getElementById("income").textContent = "MAD " + revenue;
  document.getElementById("expenses").textContent = "MAD " + expensesTotal;
  document.getElementById("profit").textContent = "MAD " + profit;
  document.getElementById("totalOrders").textContent = totalOrders;
  document.getElementById("delivered").textContent = deliveredOrders.length;
  document.getElementById("deliveredRate").textContent = "Rate " + deliveredRate + "%";
  document.getElementById("pending").textContent = pendingOrders.length;
  document.getElementById("pendingRate").textContent = "Rate " + pendingRate + "%";
  document.getElementById("canceled").textContent = canceledOrders.length;
  document.getElementById("canceledRate").textContent = "Rate " + canceledRate + "%";
  document.getElementById("successRate").textContent = successRate + "%";

  //Top Locations: top cities in terms of demand (orders regardless of status)

  let temporaryOrders = orders; //a new array used temporarirly for locations

  const percentages = computeCityPercentages(temporaryOrders);
  const locationsDiv = document.getElementById('locationsDiv');

  temporaryOrders = temporaryOrders.map(to => to.city).filter((value,index,self)=> {return self.indexOf(value) == index}).map(city => ({city:city, percentage:percentages[city]}));
  temporaryOrders.sort((a,b)=>b.percentage-a.percentage);
  locationsDiv.innerHTML = "";
  locationsDiv.innerHTML = temporaryOrders.map(order=>`
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800">${order.city}</p>
            <p class="text-xs text-gray-400">Morocco</p>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-48 bg-gray-200 rounded-full h-2">
              <div class="bg-teal-600 h-2 rounded-full" style="width: ${order.percentage}%"></div>
            </div>
            <span class="text-sm text-gray-600">${order.percentage}%</span>
          </div>
        </div>`).slice(0,3).join(""); //top 3

  const viewBtn = document.getElementById("viewLocations");
  viewBtn.addEventListener('click', e=>{
    e.preventDefault();
    if (viewBtn.textContent == "View All →"){
        locationsDiv.innerHTML = "";
        locationsDiv.innerHTML = temporaryOrders.map(order=>`
            <div class="flex items-center justify-between">
                <div>
                <p class="font-medium text-gray-800">${order.city}</p>
                <p class="text-xs text-gray-400">Morocco</p>
                </div>
                <div class="flex items-center gap-4">
                <div class="w-48 bg-gray-200 rounded-full h-2">
                    <div class="bg-teal-600 h-2 rounded-full" style="width: ${order.percentage}%"></div>
                </div>
                <span class="text-sm text-gray-600">${order.percentage}%</span>
                </div>
            </div>`).join(""); //all
            viewBtn.textContent = "Show Top 3 →";
    } else {
        locationsDiv.innerHTML = "";
        locationsDiv.innerHTML = temporaryOrders.map(order=>`
            <div class="flex items-center justify-between">
                <div>
                <p class="font-medium text-gray-800">${order.city}</p>
                <p class="text-xs text-gray-400">Morocco</p>
                </div>
                <div class="flex items-center gap-4">
                <div class="w-48 bg-gray-200 rounded-full h-2">
                    <div class="bg-teal-600 h-2 rounded-full" style="width: ${order.percentage}%"></div>
                </div>
                <span class="text-sm text-gray-600">${order.percentage}%</span>
                </div>
            </div>`).slice(0,3).join(""); //top 3
        viewBtn.textContent = "View All →"
    }

    
  })

  //Top Products: top products in terms of demand (pending orders) and acceptance (delivered orders)
  let productOrders = orders; //temporary for products
  productOrders.filter();

  const productsDiv = document.getElementById('productsDiv');
  productsDiv.innerHTML = "";
  productsDiv.innerHTML = productOrders.map(product => `
    <div class="flex justify-between">
        <div>
            <p class="font-medium">${product.name}</p>
            <p class="text-gray-500">Ordered: 4 • Delivered: 4</p>
        </div>
        <span class="font-semibold">Total: MAD 40</span>
    </div>
  `).slice(0,3).join(""); 

  
  const viewProducts = document.getElementById('viewProducts');
  


  // Customers
  const customers = {};
  orders.forEach(o => { customers[o.phone] = (customers[o.phone] || 0) + 1; });
  const newCustomers = Object.values(customers).filter(c => c===1).length;
  const returningCustomers = Object.values(customers).filter(c => c>1).length;
  const retentionRate = ((returningCustomers / (newCustomers + returningCustomers || 1)) * 100).toFixed(1);
  const lifetimeValue = revenue / (Object.keys(customers).length || 1);

//   document.querySelector("#newCustomers p:nth-child(2)").textContent = newCustomers;
//   document.querySelector("#returningCustomers p:nth-child(2)").textContent = returningCustomers;
//   document.querySelector("#retentionRate p:nth-child(2)").textContent = retentionRate + "%";
//   document.querySelector("#lifetimeValue p:nth-child(2)").textContent = "MAD " + lifetimeValue.toFixed(2);

//   // Top Products
//   const productSales = {};
//   deliveredOrders.forEach(o => productSales[o.product] = (productSales[o.product] || 0) + 1);
//   const topProducts = Object.entries(productSales).sort((a,b)=>b[1]-a[1]).slice(0,3);
//   const topProductsEl = document.getElementById("topProducts");
//   topProductsEl.innerHTML = "";
//   topProducts.forEach(([name,sales]) => {
//     const div = document.createElement("div");
//     div.className = "flex justify-between";
//     div.innerHTML = `<div><p class="font-medium">${name}</p><p class="text-gray-500">Sales: ${sales}</p></div><span class="font-semibold">MAD 0</span>`;
//     topProductsEl.appendChild(div);
//   });

//   // Top Customers
//   const topCustomersEl = document.getElementById("topCustomers");
//   topCustomersEl.innerHTML = "";
//   Object.entries(customers).sort((a,b)=>b[1]-a[1]).slice(0,3).forEach(([phone,ordersCount])=>{
//     const div = document.createElement("div");
//     div.className = "flex items-center gap-4 mb-2";
//     div.innerHTML = `<div class="flex-1"><p class="font-medium">${phone}</p><p class="text-sm text-gray-500">Orders: ${ordersCount}</p></div>`;
//     topCustomersEl.appendChild(div);
//   });

//   // Revenue / Expenses / Profit chart
//   new Chart(document.getElementById("revenueChart"), {
//     type: "line",
//     data: {
//       labels: ["Jan","Feb","Mar","Apr","May","Jun"],
//       datasets: [
//         { label:"Revenue", data:[revenue], borderColor:"#14b8a6", backgroundColor:"rgba(20,184,166,0.2)", tension:0.4 },
//         { label:"Expenses", data:[expensesTotal], borderColor:"#f87171", backgroundColor:"rgba(248,113,113,0.2)", tension:0.4 },
//         { label:"Profit", data:[profit], borderColor:"#60a5fa", backgroundColor:"rgba(96,165,250,0.2)", tension:0.4 }
//       ]
//     },
//     options:{ responsive:true, plugins:{ legend:{ position:"top" } } }
//   });

//   // Orders by weekday
//   const ordersByDay = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0};
//   const dayMap = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
//   orders.forEach(o => ordersByDay[dayMap[new Date(o.date).getDay()]]++);
//   new Chart(document.getElementById("ordersChart"), {
//     type: "bar",
//     data: { labels:Object.keys(ordersByDay), datasets:[{ label:"Orders", data:Object.values(ordersByDay), backgroundColor:"#0ea5e9" }] },
//     options:{ responsive:true }
//   });

});