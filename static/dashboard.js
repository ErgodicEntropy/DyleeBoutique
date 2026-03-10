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

function computeProductOrders(orders) {
  const totalCounts = {};
  const deliveredCounts = {}
  // Count orders per product
  orders.forEach(order => {
    const product = order.product;

    if (!totalCounts[product]) {
      totalCounts[product] = 0;
      deliveredCounts[product] = 0;
    }

    totalCounts[product]++;

    if (order.status == "Confirmed"){
      deliveredCounts[product]++;
    }

  });

  return {total: totalCounts, delivered: deliveredCounts};
}

function computeProductPrices(orders){
  const productPrices = {}
  // Count orders per product
  orders.forEach(order => {
    const product = order.product;

    if (!productPrices[product]) {
      productPrices[product] = 0;
    }

    if (order.status == "Confirmed"){
      productPrices[product] += Number(order.price);
    }

  });

  return productPrices;

}


const finance = document.getElementById('financialChart');
const orderChart = document.getElementById("ordersChart");

document.addEventListener("DOMContentLoaded", () => {

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  // const products = JSON.parse(localStorage.getItem("products")) || [];
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const customers = JSON.parse(localStorage.getItem("customers")) || [];


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

  temporaryOrders = temporaryOrders.map(to => to.city).filter((value,index,self) => {return self.indexOf(value) == index}).map(city => ({city:city, percentage:percentages[city]}));
  temporaryOrders.sort((a,b)=>b.percentage-a.percentage);
  locationsDiv.innerHTML = "";
  locationsDiv.innerHTML = temporaryOrders.map((order, index)=>`
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium text-gray-800">${index+1}. ${order.city}</p>
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
        locationsDiv.innerHTML = temporaryOrders.map((order, index)=>`
            <div class="flex items-center justify-between">
                <div>
                <p class="font-medium text-gray-800">${index+1}. ${order.city}</p>
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
        locationsDiv.innerHTML = temporaryOrders.map((order, index)=>`
            <div class="flex items-center justify-between">
                <div>
                <p class="font-medium text-gray-800">${index+1}. ${order.city}</p>
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
  const productOrderCounts = computeProductOrders(orders);
  
  const totalProductCounts = productOrderCounts.total; 
  const deliveredProductCounts = productOrderCounts.delivered;

  const productPrices = computeProductPrices(orders);

  let temporaryPO = orders;
  temporaryPO = temporaryPO.map(order=>order.product).filter((value,index,self) => {return self.indexOf(value) == index}); 
  temporaryPO = temporaryPO.map(product => ({product:product, productPrice:productPrices[product]}));
  //sort by order (weak condition), sort by delivery/price (strong condition)
  temporaryPO.sort((a,b)=> b.productPrice - a.productPrice); //we sort by price because we assume cases of products ordered frequently but rarely delivered to be rare (as order and deliver correlate) to avoid downplaying such products
  
  const productsDiv = document.getElementById('productsDiv');
  productsDiv.innerHTML = "";
  productsDiv.innerHTML = temporaryPO.map((order, index) => `
    <div class="flex justify-between">
        <div>
            <p class="font-medium">${index+1}. ${order.product}</p>
            <p class="text-gray-500">Ordered: ${totalProductCounts[order.product]} • Delivered: ${deliveredProductCounts[order.product]}</p>
        </div>
        <span class="font-semibold">Total: MAD ${order.productPrice}</span>
    </div>
  `).slice(0,3).join(""); 

  
  const viewProducts = document.getElementById('viewProducts');
  viewProducts.addEventListener('click', e=>{
    e.preventDefault();
    if (viewProducts.textContent == "View All →"){
          productsDiv.innerHTML = "";
          productsDiv.innerHTML = temporaryPO.map((order, index)=> `
            <div class="flex justify-between">
                <div>
                    <p class="font-medium">${index+1}. ${order.product}</p>
                    <p class="text-gray-500">Ordered: ${totalProductCounts[order.product]} • Delivered: ${deliveredProductCounts[order.product]}</p>
                </div>
                <span class="font-semibold">Total: MAD ${order.productPrice}</span>
            </div>
          `).join(""); //all 
            viewProducts.textContent = "Show Top 3 →";
    } else {
      productsDiv.innerHTML = "";
      productsDiv.innerHTML = temporaryPO.map((order, index) => `
        <div class="flex justify-between">
            <div>
                <p class="font-medium">${index+1}. ${order.product}</p>
                <p class="text-gray-500">Ordered: ${totalProductCounts[order.product]} • Delivered: ${deliveredProductCounts[order.product]}</p>
            </div>
            <span class="font-semibold">Total: MAD ${order.productPrice}</span>
        </div>
      `).slice(0,3).join(""); //top 3
        viewProducts.textContent = "View All →"
    }

  })

  // Customers
  const newCustomers = document.getElementById('newCustomers');
  const returningCustomers = document.getElementById('returningCustomers');
  const retentionRate = document.getElementById('retentionRate');
  const lifetimeValue = document.getElementById('lifetimeValue');

  const NC = customers.filter(customer => customer.status == "new").length;
  console.log(NC);
  newCustomers.value = NC;

  const RC = customers.filter(customer => customer.status == "returned").length; 
  console.log(RC);
  returningCustomers.value = RC;

  const RR = (returningCustomers.value/customers.length)*100;
  console.log(RR);
  retentionRate.value = RR;

  const LTV = customers.map(customer => customer.spent).reduce((sum,a)=>sum+a,0);
  console.log(LTV);
  lifetimeValue.value = LTV;


  // Revenue / Expenses / Profit chart
  // const financialChart = new Chart(finance, {
  //   type: 'line',
  //   data: {
  //     labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], //or ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] 
  //     dataset: [
  //       {
  //         label: "Revenue",
  //         data: [revenue],
  //         borderColor: "#14b8a6",
  //         backgroundColor:"rgba(20,184,166,0.2)",
  //         tension:0.5,
  //         fill: false
  //       },
  //       {
  //         label: "Expense",
  //         data: [expensesTotal],
  //         borderColor:"#f87171",
  //         backgroundColor:"rgba(248,113,113,0.2)",
  //         tension:0.5,
  //         fill: false
  //       },
  //       {
  //         label: "Profit",
  //         data: [profit],
  //         borderColor:"#60a5fa",
  //         backgroundColor:"rgba(96,165,250,0.2)",
  //         tension:0.5,
  //         fill:false
  //       }
  //     ]
  //   },
  //   options:{ responsive:true, plugins:{ legend:{ position:"top" } } }

  // })

  // // Orders by weekday
  // const ordersByDay = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0};
  // const dayMap = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  // orders.forEach(o => ordersByDay[dayMap[new Date(o.date).getDay()]]++);
  // const ordersChart = new Chart(orderChart, {
  //   type: 'bar',
  //   data: {
  //     labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  //     datasets:[{
  //       label:'Orders',
  //       data: Object.values(ordersByDay),
  //       borderColor: "#14b8a6",
  //       backgroundColor:'#0ea5e9'
  //     }]
  //   },
  //   options:{ responsive:true }
  // })



});