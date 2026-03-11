let products = JSON.parse(localStorage.getItem("products")) || [];
let customerId = JSON.parse(localStorage.getItem("customerId")) || 1; 
let orders = JSON.parse(localStorage.getItem("orders")) || [];

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

//find customer id by name + phone number
function findCustomerID(orders, customerName, customerPhone){ 
  for (let k = 0; k < orders.length; k++){
    const order = orders[k];
    if (order.customer == customerName.trim() && order.phone == customerPhone.trim()){ //order attributes are already trimmed
      return order.cid;
    }
  }
  return null; 
}

const phoneRegex = /^\+212[0-9]{9}$/; 

const manualForm = document.getElementById('manualForm'); 
const orderInput = document.getElementById("orderInputs"); 

const customer = document.getElementById('customer'); //required 
const phone = document.getElementById('phone') || ""; 

const selectedProductsDiv = document.createElement("div");
selectedProductsDiv.id = "selectedProducts";
selectedProductsDiv.className = "mt-4 space-y-2";
orderInput.appendChild(selectedProductsDiv);

let selectedProducts = []; //array of {product:string, quantity:integer} objects
let selectInput;

selectInput = document.createElement('div');
selectInput.id = "productDiv";
selectInput.innerHTML = `
<div class="w-full max-w-sm">
  <label class="block text-sm font-medium text-gray-700 mb-2">
    Product
  </label>

  <div class="relative">
    <select
      id="productName"
      class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm
             text-gray-700 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200
             focus:outline-none transition" required>

      <option value=""disabled selected>Select Product</option>
      ${products.filter(product => product.stock > 0).map(product => `
        <option value="${product.name}">${product.name} (${product.stock} left)</option>
      `).join("")}
    </select>

    <svg class="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
         fill="none" stroke="currentColor" stroke-width="2"
         viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
    </svg>
  </div>
</div>`

orderInput.appendChild(selectInput);
let product = document.getElementById('productName'); //required 

let quantity; 

let limit; 

let arr = [];

const productChangeEvent = e =>{
  e.preventDefault();
  
  limit = findOrderProduct(product.value.trim()).stock;
  
  for (let k = 1; k <= limit; k++){
    arr.push(k);
  }

  const quantityInput = document.createElement('div');
  quantityInput.id = "quantityDiv"; 
  quantityInput.innerHTML = `
  <div class="w-full max-w-sm">
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Quantity
    </label>
  
    <div class="relative">
      <select
        id="productQuantity"
        class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm
               text-gray-700 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200
               focus:outline-none transition" required>
  
        <option value="" disabled selected>Select Quantity</option>
        ${arr.map(index=> `
          <option value="${index}">${index}</option>
        `).join("")}
      </select>
  
      <svg class="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
           fill="none" stroke="currentColor" stroke-width="2"
           viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </div>
  </div>`;
  arr = [];
  orderInput.appendChild(quantityInput);
  quantity = document.getElementById('productQuantity'); //required

  quantity.addEventListener('change', e=>{

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.id = "addProductBtn";
    addBtn.className = "mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm";
    addBtn.textContent = "Add Product";

    orderInput.appendChild(addBtn);
  })
}

product.addEventListener('change', productChangeEvent);

// product.addEventListener('change', e=>{
//   e.preventDefault();
  
//   limit = findOrderProduct(product.value.trim()).stock;
  
//   for (let k = 1; k <= limit; k++){
//     arr.push(k);
//   }

//   const quantityInput = document.createElement('div');
//   quantityInput.id = "quantityDiv"; 
//   quantityInput.innerHTML = `
//   <div class="w-full max-w-sm">
//     <label class="block text-sm font-medium text-gray-700 mb-2">
//       Quantity
//     </label>
  
//     <div class="relative">
//       <select
//         id="productQuantity"
//         class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm
//                text-gray-700 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200
//                focus:outline-none transition" required>
  
//         <option value="" disabled selected>Select Quantity</option>
//         ${arr.map(index=> `
//           <option value="${index}">${index}</option>
//         `).join("")}
//       </select>
  
//       <svg class="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
//            fill="none" stroke="currentColor" stroke-width="2"
//            viewBox="0 0 24 24">
//         <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
//       </svg>
//     </div>
//   </div>`;

//   orderInput.appendChild(quantityInput);
//   quantity = document.getElementById('productQuantity'); //required

//   quantity.addEventListener('change', e=>{

//     const addBtn = document.createElement("button");
//     addBtn.type = "button";
//     addBtn.id = "addProductBtn";
//     addBtn.className = "mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm";
//     addBtn.textContent = "Add Product";

//     orderInput.appendChild(addBtn);
//   })

// })

orderInput.addEventListener("click", (e) => {
  if (e.target.id === "addProductBtn") {

    if (!product.value || !quantity.value) {
      alert("Select product and quantity");
      return;
    }

    const productName = product.value.trim();
    const qty = Number(quantity.value.trim());

    selectedProducts.push({
      product: productName,
      quantity: qty
    });

    // Display selected product
    const item = document.createElement("div");
    item.className = "flex justify-between bg-gray-100 px-3 py-2 rounded";

    item.innerHTML = `
      <span>${productName}</span>
      <span class="font-semibold">x${qty}</span>
    `;

    selectedProductsDiv.appendChild(item);

    const productObj = findOrderProduct(productName);
      if (productObj){
        productObj.stock -= Number(qty);
      }
    saveProducts(); 

    // reset selectors
    product.value = "";
    quantity.value = ""; //unnecessary because quantityDiv is deleted anyway

    const productDiv = document.getElementById("productDiv");
    if (productDiv){
      productDiv.innerHTML = `
        <div class="w-full max-w-sm">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Product
          </label>
  
          <div class="relative">
            <select
              id="productName"
              class="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2.5 pr-10 text-sm
                    text-gray-700 shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-200
                    focus:outline-none transition">
  
              <option value=""disabled selected>Select Product</option>
              ${products.filter(p => p.stock > 0).map(p => {
                if (p.name === product.value.trim()){
                  return `<option value="${p.name}">${p.name} (${limit} left)</option>`
                }
                return `
                <option value="${p.name}">${p.name} (${p.stock} left)</option>
              `}).join("")}
            </select>
  
            <svg class="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none"
                fill="none" stroke="currentColor" stroke-width="2"
                viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>`;
        product = document.getElementById('productName'); //required 
        product.addEventListener('change', productChangeEvent);
      }

    const quantityDiv = document.getElementById("quantityDiv");
    if (quantityDiv) quantityDiv.remove(); 

    const btn = document.getElementById("addProductBtn");
    if (btn) btn.remove();
  }
});

const price = document.getElementById('price'); //required 
const city = document.getElementById('city') || ""; 
const address = document.getElementById('address') || ""; 

const phoneDiv = document.getElementById('phoneDiv');

manualForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (phone){
      try {
        const match = phoneRegex.test(phone.value.trim()); 
        if (!match){
          const span = document.createElement('span');
          span.textContent = "";
          span.className = "text-sm font-semibold text-red-500 mt-1";
          span.textContent = "Invalid phone number";
          phoneDiv.appendChild(span);
          throw new Error("Invalid phone number");
        }

        // const productName = product.value.trim();
        // const productObj = findOrderProduct(productName);
        // if (productObj){
        //   productObj.stock -= Number(quantity.value.trim()); //product removed from the product list
        //   saveProducts(); 
        // }

        // selectedProducts.forEach(item => {
        //   const productObj = findOrderProduct(item.product);
        //   if (productObj){
        //     productObj.stock -= Number(item.quantity);
        //   }
        // });
        // saveProducts(); 

        
        const CID = findCustomerID(orders, customer.value, phone.value); 
        const id = CID ?? customerId; 
        console.log(CID);
        if (id == customerId){
          customerId++
          localStorage.setItem("customerId", customerId);
        };
        const data = {
            cid: id,
            customer: customer.value.trim(),
            phone: phone.value.trim(),
            products: selectedProducts,
            price: price.value.trim(),
            city: city.value.trim(),
            address: address.value.trim()
          };

        // const data = {
        //     cid: id,
        //     customer: customer.value.trim(),
        //     phone: phone.value.trim(),
        //     product: product.value.trim(),
        //     quantity: Number(quantity.value.trim()),
        //     price: price.value.trim(),
        //     city: city.value.trim(),
        //     address: address.value.trim()
        //   };


        for (const key in data) {
          if (!data[key]) {
            alert(`Please fill the ${key} field.`);
            return;
          }
        }

        if (!data){
          console.log("empty data");
        }

        window.localStorage.setItem("orderdata", JSON.stringify(data))

          Swal.fire({
          icon: "success",
          title: "Add",
          text: "Order Added!",
          timer: 2000,
          timerProgressBar: true
        });

        setTimeout(()=>{
          window.location.href = './orders.html';
        }, 3000)


      }catch(err){
        console.log(err.message);
      }
  }

});

// Upload form handling
const uploadForm = document.getElementById('uploadForm');

uploadForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = uploadForm.querySelector('input[type="file"]');
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file to upload.");
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    try {
      // Parse JSON content
      const orders = JSON.parse(event.target.result);

      if (!Array.isArray(orders)) {
        throw new Error("Invalid JSON format. Must be an array of orders.");
      }

      // Retrieve existing orders from localStorage
      const existingOrders = JSON.parse(localStorage.getItem("orders")) || [];

      // Add new orders
      orders.forEach(order => {
        // Basic validation for required fields
        const requiredFields = ["customer", "phone", "product", "price", "city", "address"];
        for (const field of requiredFields) {
          if (!order[field]) {
            throw new Error(`Missing field "${field}" in one of the orders.`);
          }
        }

        // Add default fields if missing
        if (!order.date) order.date = new Date().toISOString().split('T')[0];
        if (!order.status) order.status = "Pending";

        existingOrders.push(order);
      });

      // Save updated orders back to localStorage
      localStorage.setItem("orders", JSON.stringify(existingOrders));

      Swal.fire({
        icon: "success",
        title: "Upload Successful",
        text: `${orders.length} orders added!`,
        timer: 2000,
        timerProgressBar: true
      });

      setTimeout(() => {
        window.location.href = './orders.html';
      }, 2500);

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: err.message,
      });
    }
  };

  reader.readAsText(file);
});

