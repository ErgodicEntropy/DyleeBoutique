let products = JSON.parse(localStorage.getItem("products")) || [];
let productId = JSON.parse(localStorage.getItem("productId")) || 0; // Fix Product ID system: decouple products of the same name into product.stock many products with the same name
let orders = JSON.parse(localStorage.getItem("orders")) || [];


const productHead = document.getElementById("productHead");
const productBody = document.getElementById("productBody");
const cardContainer = document.getElementById("cardContainer");

const tableBtn = document.getElementById("tableBtn");
const cardBtn = document.getElementById("cardBtn");

const tableDiv = document.getElementById("tableDiv");
const cardDiv = document.getElementById("cardDiv");


const downloadBtn = document.getElementById("downloadBtn");
const exportBtn = document.getElementById("exportBtn");

/* ----------------------- STORAGE ----------------------- */

function saveProducts(){
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("productId", productId);
}

function saveOrders() {
  localStorage.setItem("orders", JSON.stringify(orders));
}

function isOrderProduct(product, order){//checks whether a given product is checked or belongs to a given order
  return order.products.some(productObj => productObj.product === product.name);
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

<td class="p-4">${product.name}</td>

<td class="p-4">${product.size}</td>

<td class="p-4">${product.category}</td>

<td class="p-4">${product.brand}</td>

<td class="p-4">${product.cost}DH</td>

<td class="p-4">${product.price}DH</td>

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
<div class="col-span-full text-center p-10 bg-white rounded-xl shadow">
No products yet
</div>
`;

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
: "text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold"
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

let oldname = product.name;

const overlay = document.createElement("div");

overlay.className =
"fixed inset-0 bg-black/30 flex items-center justify-center z-[1000]";

overlay.innerHTML = `

<div class="bg-white rounded-xl shadow-xl w-11/12 max-w-md p-6">

<div class="space-y-3">

<input id="name" value="${product.name}" class="w-full border p-2 rounded">

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

product.category = document.getElementById("category").value;

product.brand = document.getElementById("brand").value;

product.cost = document.getElementById("cost").value;

product.price = document.getElementById("price").value;

product.stock = document.getElementById("stock").value;

const file = document.getElementById("image").files[0];

if(file){

product.image = await readImage(file);

}

affectedOrders.forEach(affectedOrder => {//forEach makes implicit assignemnts -> no need to make changes on orders array because affectedOrder is a reference to orders object elements (deep copy in case of compounded data type: same memory address)
  affectedOrder.products.forEach(productObj => {
    if (productObj.product === oldname){
      productObj.product = product.name;
    }
  }) 
})
saveOrders();


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

products = products.filter(p => p.id !== id);

saveProducts();

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

products = products.filter(p => p.id !== id);

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



/* ----------------------- EXPORT CSV ----------------------- */

exportBtn.onclick = () => {

let csv = "id,name,category,brand,cost,price,stock\n";

products.forEach(p => {

csv += `${p.id},${p.name},${p.category},${p.brand},${p.cost},${p.price},${p.stock}\n`;

});

const blob = new Blob([csv], { type: "text/csv" });

const link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = "products.csv";

link.click();

URL.revokeObjectURL(link.href);

};



/* ----------------------- INIT ----------------------- */

document.addEventListener("DOMContentLoaded", () => {


const newProduct = JSON.parse(localStorage.getItem("productdata"));

if(newProduct){

productId++;

newProduct.id = productId;

products.push(newProduct);

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