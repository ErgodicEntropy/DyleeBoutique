let products = JSON.parse(localStorage.getItem("products")) || [];
let productId = JSON.parse(localStorage.getItem("productId")) || 1; // Fix Product ID system: decouple products of the same name into product.stock many products with the same name
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let orderId = JSON.parse(localStorage.getItem("orderId")) || 1;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let expenseId = JSON.parse(localStorage.getItem("expenseId")) || 1;
let customerId = JSON.parse(localStorage.getItem("customerId")) || 1; 



const productHead = document.getElementById("productHead");
const productBody = document.getElementById("productBody");
const cardContainer = document.getElementById("cardContainer");

const tableBtn = document.getElementById("tableBtn");
const cardBtn = document.getElementById("cardBtn");

const tableDiv = document.getElementById("tableDiv");
const cardDiv = document.getElementById("cardDiv");


const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");

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
/* ----------------------- STORAGE ----------------------- */

function saveProducts(){
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("productId", productId);
}

function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function isOrderProduct(product, order){//checks whether a given product is checked or belongs to a given order
  return order.products.some(productObj => productObj.product === product.name);
}

function sumProductQuantity(product, order){
  const productObj = order.products.find(productObj => productObj.product === product.name)
  if (!productObj) return 0; 
  return productObj.quantity;
}

/* ----------------------- IMAGE ----------------------- */

function readImage(file){

return new Promise((resolve,reject)=>{

const reader = new FileReader();

reader.onload = () => resolve(reader.result);

reader.onerror = reject;

reader.readAsDataURL(file);

});

}



/* ----------------------- TABLE RENDER ----------------------- */

function renderTable(){

productBody.innerHTML = "";
if(products.length === 0){
  productBody.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow">
    
      <svg xmlns="http://www.w3.org/2000/svg" 
        class="w-16 h-16 text-gray-300 mb-4"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M17 20h5V4H2v16h5m10 0v-6a3 3 0 00-6 0v6m6 0H7"/>
      </svg>

      <h2 class="text-xl font-semibold text-gray-700 mb-2">
        No Products Yet
      </h2>

      <p class="text-gray-500 text-sm mb-5 max-w-sm">
        When you add a product, its metadata will automatically appear here.
      </p>

      <a href="add_product.html"
        class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition">
        Create First Product
      </a>

    </div>
    `;
    productHead.classList.add("hidden");
    return;
  } else {
    productHead.innerHTML = `
        <tr>
          <th class="p-4">Name</th>
          <th class="p-4">Size</th>
          <th class="p-4">Category</th>
          <th class="p-4">Brand</th>
          <th class="p-4">Cost</th>
          <th class="p-4">Estimated Price (Min)</th>
          <th class="p-4">Market Price (Max)</th>
          <th class="p-4">Stock</th>
          <th class="p-4">Image</th>
          <th class="p-4">Action</th>
        </tr>`;    
    productHead.classList.remove("hidden");
  }


products.forEach(product => {

    let stockClass = "p-4 font-semibold text-green-600";
    let stockMessage = "Available stock"; 
    if (product.stock <= 0){ //if the stock of your product is 0, then it is indicated in red with a message (better than self-removal while zero)
        stockClass = "p-4 font-semibold text-red-600"; //indicates financial loss or risk
        stockMessage = "You're out of stock!";
    }
        // https://www.lemarketprice.com/en/products/?q=${product.name}
productBody.insertAdjacentHTML("beforeend",`

<tr id="tr-${product.id}" class="border-t">

<td class="${
product.stock > 0
? "p-4 font-semibold"
: "p-4 text-red-600 font-semibold text-decoration-line: line-through"
}">${product.name}</td>

<td class="${
product.stock > 0
? "p-4 font-semibold"
: "p-4 text-red-600 font-semibold text-decoration-line: line-through"
}">${product.size}</td>

<td class="${
product.stock > 0
? "p-4 font-semibold"
: "p-4 text-red-600 font-semibold text-decoration-line: line-through"
}">${product.category}</td>

<td class="${
product.stock > 0
? "p-4 font-semibold"
: "p-4 text-red-600 font-semibold text-decoration-line: line-through"
}">${product.brand}</td>

<td class="${
product.stock > 0
? "p-4 font-semibold"
: "p-4 text-red-600 font-semibold text-decoration-line: line-through"
}">${product.cost}DH</td>

<td class="${
product.stock > 0
? "p-4 font-semibold"
: "p-4 text-red-600 font-semibold text-decoration-line: line-through"
}">${product.price}DH</td>

<td class="p-4">
 <a href="https://www.marjanemall.ma/catalogsearch/result?q=${product.name}" target="_blank"
     class="block px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition">
    MarjaneMall
  </a>

  <a href="https://www.jumia.ma/catalog/?q=${product.name}" target="_blank"
     class="block px-3 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
    Jumia
  </a>

  <a href="https://www.avito.ma/fr/maroc/${product.name}" target="_blank"
     class="block px-3 py-2 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition">
    Avito
  </a>
</td>

<td class="${stockClass}" title="${stockMessage}">${product.stock}</td>

<td class="p-4">
 <a href="${product.image}" target="_blank">
    <img src="${product.image}" class="w-16 h-16 object-cover rounded cursor-pointer">
  </a>
</td>

<td class="p-4 space-y-2">

<button
data-id="${product.id}"
class="captionBtn text-white bg-purple-500 px-3 py-1 rounded-full">

Caption

</button>

<button
data-id="${product.id}"
class="updateBtn text-white bg-blue-500 px-3 py-1 rounded-full">

Edit

</button>

<button
data-id="${product.id}"
class="deleteBtn text-white bg-red-500 px-3 py-1 rounded-full">

Delete

</button>

</td>

</tr>

`);

});

}



/* ----------------------- CARD RENDER ----------------------- */

function renderCards(){

cardContainer.innerHTML = "";

if(products.length === 0){

cardContainer.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center text-center bg-white p-10 rounded-xl shadow">
    
      <svg xmlns="http://www.w3.org/2000/svg" 
        class="w-16 h-16 text-gray-300 mb-4"
        fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M17 20h5V4H2v16h5m10 0v-6a3 3 0 00-6 0v6m6 0H7"/>
      </svg>

      <h2 class="text-xl font-semibold text-gray-700 mb-2">
        No Products Yet
      </h2>

      <p class="text-gray-500 text-sm mb-5 max-w-sm">
        When you add a product, its metadata will automatically appear here.
      </p>

      <a href="add_product.html"
        class="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition">
        Create First Product
      </a>

    </div>
    `;
    productHead.classList.add("hidden");
    return;

}

products.forEach(product => {

cardContainer.insertAdjacentHTML("beforeend",`

<div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">

<img src="${product.image}" class="w-full h-48 object-cover">

<div class="p-4">

<div class="flex justify-between items-center mb-2">

<h2 class="text-lg font-semibold text-gray-800">

${product.name}

</h2>

<span class="${
product.stock > 0
? "text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 font-semibold"
: "text-xs px-2 py-1 rounded-full bg-red-200 text-red-600 font-semibold"
}">

${product.stock > 0 ? "Available" : "Out of Stock"}

</span>

</div>

<p class="text-sm text-gray-500">Category: ${product.category}</p>

<p class="text-sm text-gray-500 mb-2">Brand: ${product.brand}</p>

<div class="flex justify-between mt-3">

<span class="font-bold text-gray-900">

Cost: ${product.cost}DH

</span>

<span class="font-bold text-gray-900">

Estim. Price: ${product.price}DH

</span>

</div>

</div>

<div class="flex border-t">

<button
data-id="${product.id}"
class="captionBtn flex-1 py-2 text-white bg-purple-600 hover:bg-purple-700">

Caption

</button>

<button
data-id="${product.id}"
class="updateBtn flex-1 py-2 text-white bg-blue-600 hover:bg-blue-700">

Edit

</button>

<button
data-id="${product.id}"
class="deleteBtn flex-1 py-2 text-white bg-red-600 hover:bg-red-700">

Delete

</button>

</div>

</div>

`);

});

}



/* ----------------------- UPDATE MODAL ----------------------- */

function openUpdateModal(product){

const affectedOrders = orders.filter(order => isOrderProduct(product,order)); //find all orders affected by changes in the current product before such changes take place (save)

const affectedExpenses = expenses.filter(expense => expense.productId === product.id); //find the one expense affected by changes in the current product before such changes take place (save)

let oldname = product.name;

let oldstock = product.stock; 

const overlay = document.createElement("div");

overlay.className =
"fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]";

overlay.innerHTML = `

<div class="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6">

<div class="space-y-3">

<input id="name" value="${product.name}" class="w-full border p-2 rounded">

<input id="size" value="${product.size}" class="w-full border p-2 rounded">

<input id="category" value="${product.category}" class="w-full border p-2 rounded">

<input id="brand" value="${product.brand}" class="w-full border p-2 rounded">

<input id="cost" type="number" value="${product.cost}" class="w-full border p-2 rounded">

<input id="price" type="number" value="${product.price}" class="w-full border p-2 rounded">

<input id="stock" type="number" value="${product.stock}" class="w-full border p-2 rounded">

<input id="image" type="file" accept="image/*">

<div class="flex justify-end gap-3">

<button id="cancelBtn"
class="px-3 py-1 bg-gray-300 rounded">

Cancel

</button>

<button id="saveBtn"
class="px-3 py-1 bg-green-500 text-white rounded">

Save

</button>

</div>

</div>

</div>

`;

document.body.appendChild(overlay);



document.getElementById("cancelBtn").onclick = () => overlay.remove();



document.getElementById("saveBtn").onclick = async () => {

product.name = document.getElementById("name").value;

product.size = document.getElementById("size").value;

product.category = document.getElementById("category").value;

product.brand = document.getElementById("brand").value;

product.cost = document.getElementById("cost").value;

product.price = document.getElementById("price").value;

product.stock = document.getElementById("stock").value;

product.initialStock = (!orders.some(order => isOrderProduct(product, order))) ? document.getElementById("stock").value: product.initialStock;

let stockCounter = (!orders.some(order => isOrderProduct(product, order))) ? Number(product.initialStock || 0): Number(product.stock || 0) + Number(orders.map(order => sumProductQuantity(product,order)).reduce((sum,c)=>sum + c,0) || 0);

// let stockCounter = (!orders.some(order => isOrderProduct(product, order))) ? Number(product.initialStock || 0):Number(product.initialStock || 0) + Number(product.stock || 0) - Number(oldstock || 0); //using a proxy for order tracking: initialStock - oldstock (stock before current edit) but this proxy has a broken edge case

const file = document.getElementById("image").files[0];

if(file){

product.image = await readImage(file);

}

affectedOrders.forEach(affectedOrder => {//forEach makes implicit assignments -> no need to make changes on orders array because affectedOrder is a reference to orders object elements (deep copy in case of compounded data type: same memory address)
  affectedOrder.products.forEach(productObj => {
    if (productObj.product === oldname){
      productObj.product = product.name;
    }
  }) 
})
saveOrders();

affectedExpenses.forEach(affectedExpense =>{//forEach makes implicit assignemnts -> no need to make changes on expenses array because affectedExpense is a reference to expenses object elements (deep copy in case of compounded data type: same memory address)
  affectedExpense.name = product.name;
  affectedExpense.amount = Number(product.cost || 0)*stockCounter;
  affectedExpense.details = `(${product.cost}DH x ${stockCounter})`;
})

saveExpenses();

saveProducts();

renderTable();

renderCards();

overlay.remove();


};



}



/* ----------------------- EVENTS ----------------------- */

productBody.addEventListener("click", e => {

  if (e.target.classList.contains("captionBtn")){
    const id = Number(e.target.dataset.id);

    const product = products.find(p => p.id === id);

    Swal.fire({
      title: "Product Caption",
      html:`
      <div class="max-w-2xl mx-auto p-6 bg-gray-50 font-sans">
        <h2 class="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Social Media Caption</h2>

        <div class="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-bold uppercase tracking-wider text-blue-600">The FOMO Vibe (Darija)</span>
            <button id="copyBtn" class="text-sm text-gray-400 hover:text-blue-500">Copy</button>
          </div>
          <p id="captionParagraph" class="text-gray-700 leading-relaxed">
            عييتي كتقلبي على الجودة وبثمن معقول؟ 🤔  

            جربي <strong>${product.name}</strong> من <strong>${product.brand}</strong> ✨  
            مثالي سواء لوليدك الصغير أو لأي واحد باغي <strong>${product.category}</strong> مريح، زوين ويدوم مع الوقت.  

            غير بـ <strong>${product.price} درهم</strong> برك! 💸  
            وردي بالك… بقاو غير <strong>${product.stock} حبات</strong> فالسوك، والطلب عليهم طالع بزاف ⏳  

            ما تضيعش الفرصة وخلي السلة ديالك عامرة 😍  

            📩 تواصلي معنا دابا: [Link]  

            #DyleeBoutique #Morocco #ملابس_أطفال #تخفيضات #${product.brand}
        </p>
        </div>

      </div>`,
      showConfirmButton: true,
      confirmButtonText: 'Done',
      didOpen: ()=>{
        const paragraph = document.getElementById('captionParagraph');
        const copyBtn = document.getElementById("copyBtn");
        copyBtn.addEventListener('click',async (e)=>{
          e.preventDefault();
          try {
            await navigator.clipboard.writeText(paragraph.innerText);
            copyBtn.textContent = "✅ Copied!";
            copyBtn.classList.replace('text-blue-500', 'text-green-600');
            
            setTimeout(() => {
              copyBtn.textContent = "Copy Text";
              copyBtn.classList.replace('text-green-600', 'text-blue-500');
            }, 2000);
          } catch(err){
            console.error('Failed to copy text: ', err);       
          }
        })
      }
    })
  }
  if(e.target.classList.contains("deleteBtn")){

    const id = Number(e.target.dataset.id);

    const product = products.find(p => p.id === id);

    const affectedOrders = orders.filter(order => isOrderProduct(product, order)); //find all orders affected by changes in the current product before such changes take place (save)

    affectedOrders.forEach(affectedOrder => {//forEach makes implicit assignemnts -> no need to make changes on orders array because affectedOrder is a reference to orders object elements (deep copy in case of compounded data type: same memory address)
      orders = orders.filter(o => o.id != affectedOrder.id);
      orderId--;
    })
    saveOrders();

    const affectedExpenses = expenses.filter(expense => expense.productId === product.id); //find all expenses affected by changes in the current product before such changes take place (save)
    affectedExpenses.forEach(affectedExpense =>{
      expenses = expenses.filter(e => e.id != affectedExpense.id);
      expenseId--;
    })
    saveExpenses();
    
    // products.splice(products.indexOf(product),1);
    products = products.filter(p => p.id !== id);

    productId--; 

    saveProducts();

    window.location.reload();

    renderTable();

  }

  if(e.target.classList.contains("updateBtn")){

    const id = Number(e.target.dataset.id);

    const product = products.find(p => p.id === id);

    openUpdateModal(product);

    }

});



cardContainer.addEventListener("click", e => {

if(e.target.classList.contains("deleteBtn")){

const id = Number(e.target.dataset.id);

const product = products.find(p => p.id === id);

const affectedOrders = orders.filter(order => isOrderProduct(product, order)); //find all orders affected by changes in the current product before such changes take place (save)

affectedOrders.forEach(affectedOrder => {//forEach makes implicit assignemnts -> no need to make changes on orders array because affectedOrder is a reference to orders object elements (deep copy in case of compounded data type: same memory address)
  orders = orders.filter(o => o.id != affectedOrder.id);
  orderId--; 
})
saveOrders();

const affectedExpenses = expenses.filter(expense => expense.productId === product.id); //find all expenses affected by changes in the current product before such changes take place (save)

affectedExpenses.forEach(affectedExpense => {
  expenses = expenses.filter(e => e.id != affectedExpense.id); 
  expenseId--;
})

saveExpenses(); 

products = products.filter(p => p.id !== id);

productId--; 

saveProducts();

renderCards();

renderTable();

}

if(e.target.classList.contains("updateBtn")){

const id = Number(e.target.dataset.id);

const product = products.find(p => p.id === id);

openUpdateModal(product);

}

});



/* ----------------------- VIEW TOGGLE ----------------------- */

tableBtn.onclick = () => {

renderTable();

tableDiv.classList.remove("hidden");

cardDiv.classList.add("hidden");

};



cardBtn.onclick = () => {

renderCards();

cardDiv.classList.remove("hidden");

tableDiv.classList.add("hidden");

};


/* ----------------------- DOWNLOAD JSON ----------------------- */

downloadBtn.onclick = () => {

const blob = new Blob([JSON.stringify(products, null, 2)], {
type: "application/json"
});

const link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = "products.json";

link.click();

URL.revokeObjectURL(link.href);
};



/* ----------------------- Clear Table ----------------------- */

clearBtn.onclick = () =>{
  Swal.fire({
    title:"Clear Table",
    html:`<p> Are you sure you want to <strong>clear</strong> your table ? 
      <br>
      All your data will be gone!
    </p>`,
    showConfirmButton: true,
    confirmButtonText: "Confirm",
  }).then(()=>{
    try {
      localStorage.removeItem('productId');
      localStorage.removeItem('products');
      localStorage.removeItem('orderId');
      localStorage.removeItem('orders');
      localStorage.removeItem('customerId');
      localStorage.removeItem('customers');
      localStorage.removeItem('expenseId');
      localStorage.removeItem('expenses');
      window.location.reload();
      Swal.fire({
        icon:"success",
        text:"Table Cleared",
        title:"Table",
        timer:2000,
        timerProgressBar:true
      })
    }catch(err){
      Swal.fire({
        icon:"error",
        text:err.message,
        title:"Oops...",
        timer:2000,
        timerProgressBar:true
      })
    }
  })
}


/* ----------------------- INIT ----------------------- */

document.addEventListener("DOMContentLoaded", () => {


const newProduct = JSON.parse(localStorage.getItem("productdata"));

if(newProduct){

  
newProduct.id = productId;

products.push(newProduct);

productId++;

saveProducts();

localStorage.removeItem("productdata");


}

//product self-removal from table and card systems when its stock is 0 (optional)
// products.forEach(product => {
//     if (product.stock <= 0){
//         products = products.filter(p => p.id !== product.id);
//     }

// })
renderTable();

tableDiv.classList.remove("hidden");

});