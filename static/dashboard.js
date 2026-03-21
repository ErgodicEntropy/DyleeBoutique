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
    order.products.forEach(productObj => {
      if (!totalCounts[productObj.product]) {
        totalCounts[productObj.product] = 0;
        deliveredCounts[productObj.product] = 0;
      }
  
      totalCounts[productObj.product]++;
  
      if (order.status == "Confirmed"){
        deliveredCounts[productObj.product]++;
      }
  
    });

    })


  return {total: totalCounts, delivered: deliveredCounts};
}

function computeProductPrices(orders){
  const productPrices = {}
  // Count orders per product
  orders.forEach(order => {
    order.products.forEach(productObj => {
      if (!productPrices[productObj.product]) {
        productPrices[productObj.product] = 0;
      }
  
      if (order.status == "Confirmed"){
        productPrices[productObj.product] += Number(order.price);
      }
  
    });

    })

  return productPrices;

}

function CantorPair(arr){
  if (arr.length === 0) return undefined;
  if (arr.length === 1) return arr[0]; 
  const firstObjectId = arr[0];
  const secondObjectId = arr[1];
  let identifier = (firstObjectId + secondObjectId)*(firstObjectId + secondObjectId + 1)/2 + secondObjectId; 
  for (let k = 2; k < arr.length; k++){
    const ObjectId = arr[k];
    identifier = (identifier + ObjectId)*(identifier + ObjectId + 1)/2 + ObjectId; 
  }
  return identifier; 
}

const finance = document.getElementById('financialChart').getContext("2d");
const orderChart = document.getElementById("ordersChart").getContext("2d");

document.addEventListener("DOMContentLoaded", () => {

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


  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  // const products = JSON.parse(localStorage.getItem("products")) || [];
  const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const customers = JSON.parse(localStorage.getItem("customers")) || [];

  let revenueArr = JSON.parse(localStorage.getItem("revenueArr")) || [{value: 0, identifier: null}];
  let expenseArr = JSON.parse(localStorage.getItem("expenseArr")) || [{value: 0, identifier: null}];
  let profitArr = JSON.parse(localStorage.getItem("profitArr")) || [{value: 0, identifier: null}];

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.status === "Confirmed"); // Delivered = Confirmed = Shipped = Received
  const pendingOrders = orders.filter(o => o.status === "Pending");
  const canceledOrders = orders.filter(o => o.status === "Canceled");

  // Revenue & Expenses
  const revenue = deliveredOrders.reduce((sum,o)=>sum+Number(o.price||0),0);
  console.log("delivered orders", deliveredOrders);
  console.log("delivered orders ids", deliveredOrders.map(o => o.id));
  const revenueObj = {
    value: revenue,
    identifier: CantorPair(deliveredOrders.map(o => o.id)) //Cantor pairing function to produce a unique number from two integers
  }
  if (!revenueArr.some(ro => ro.identifier == revenueObj.identifier)){
    revenueArr.push(revenueObj);
    localStorage.setItem('revenueArr', JSON.stringify(revenueArr));
  }

  const expensesTotal = expenses.reduce((sum,e)=>sum+Number(e.amount||0),0)
  const expenseObj = {
    value: expensesTotal,
    identifier: CantorPair(expenses.map(e => e.id)) //Cantor pairing function to produce a unique number from two integers
  }
  if (!expenseArr.some(eo => eo.identifier == expenseObj.identifier)){
    expenseArr.push(expenseObj);
    localStorage.setItem('expenseArr', JSON.stringify(expenseArr));
  }

  const profit = revenue - expensesTotal;
  const profitObj = {
    value: profit,
    identifier: CantorPair([...deliveredOrders.map(o => o.id), ...expenses.map(e => e.id)])
  }
  if (!profitArr.some(po => po.identifier == profitObj.identifier)){
    profitArr.push(profitObj);
    localStorage.setItem('profitArr', JSON.stringify(profitArr));
  }

  const deliveredRate = totalOrders === 0 ? 0 : ((deliveredOrders.length / totalOrders) * 100).toFixed(2);
  const pendingRate = totalOrders === 0 ? 0 : ((pendingOrders.length / totalOrders) * 100).toFixed(2);
  const canceledRate = totalOrders === 0 ? 0 : ((canceledOrders.length / totalOrders) * 100).toFixed(2);
  const successRate = (deliveredRate - canceledRate).toFixed(2);

  // Update metrics
  document.getElementById("income").textContent = "MAD " + revenue;
  document.getElementById("expenses").textContent = "MAD " + expensesTotal;
  document.getElementById("profit").className = (profit <= 0) ? "text-2xl font-bold text-red-600":"text-2xl font-bold text-green-600";
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

  let temporaryOrders = orders; //a new array used temporarily for locations

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
  temporaryPO = temporaryPO.map(order=>order.products).map(productArr => productArr.map(productObj => productObj.product)); 
  let bigArr = []; 
  for (let k = 0; k < temporaryPO.length; k++){
      bigArr = [...bigArr, temporaryPO[k]]
  }
  temporaryPO = bigArr.filter((value, index, self) => self.indexOf(value) == index);
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
  newCustomers.textContent = NC;

  const RC = customers.filter(customer => customer.status == "returned").length; 
  returningCustomers.textContent = RC;

  const RR = ((Number(returningCustomers.textContent)/customers.length)*100).toFixed(2);
  retentionRate.textContent = RR;

  const LTV = customers.map(customer => customer.spent).reduce((sum,a)=>sum+a,0);
  lifetimeValue.textContent = LTV;

  console.log(customers);

  // Revenue / Expenses / Profit chart
  const financialChart = new Chart(finance, {
    type: 'line',
    data: {
      labels: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], //or ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] 
      datasets: [
        {
          label: "Revenue",
          data: revenueArr.map(revObj => revObj.value),
          borderColor: "#1424b8",
          tension:0.5,
          fill: false
        },
        {
          label: "Expense",
          data: expenseArr.map(expObj => expObj.value),
          borderColor:"#f87171",
          tension:0.5,
          fill: false
        },
        {
          label: "Profit",
          data: profitArr.map(profitObj => profitObj.value),
          borderColor:"#60a5fa",
          tension:0.5,
          fill:false
        }
      ]
    },
    options:{ responsive:true, plugins:{ legend:{ position:"top" } } }

  })

  // Orders by weekday
  const ordersByDay = {Mon:0,Tue:0,Wed:0,Thu:0,Fri:0,Sat:0,Sun:0};
  const dayMap = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  orders.forEach(o => ordersByDay[dayMap[new Date(o.date).getDay()]]++);
  const ordersChart = new Chart(orderChart, {
    type: 'bar',
    data: {
      labels:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
      datasets:[{
        label:'Orders',
        data: Object.values(ordersByDay),
        borderColor: "#14b8a6",
        backgroundColor:'#0ea5e9'
      }]
    },
    options:{ responsive:true }
  })



});