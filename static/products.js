let products = JSON.parse(localStorage.getItem("products")) || [];
let productId = JSON.parse(localStorage.getItem("productId")) || 0; // Fix Product ID system: decouple products of the same name into product.stock many products with the same name

const productBody = document.getElementById("productBody");
const cardContainer = document.getElementById("cardContainer");

const tableBtn = document.getElementById("tableBtn");
const cardBtn = document.getElementById("cardBtn");

const tableDiv = document.getElementById("tableDiv");
const cardDiv = document.getElementById("cardDiv");

const startTr = document.getElementById("columns");

const downloadBtn = document.getElementById("downloadBtn");
const exportBtn = document.getElementById("exportBtn");

/* ----------------------- STORAGE ----------------------- */

function saveProducts(){
localStorage.setItem("products", JSON.stringify(products));
localStorage.setItem("productId", productId);
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
<tr>
<td colspan="9" class="p-6 text-center text-gray-500">
No products yet
</td>
</tr>
`;

return;

}

startTr.classList.remove("hidden");

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
class="postBtn text-white bg-purple-500 px-3 py-1 rounded-full">

Post

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
class="postBtn flex-1 py-2 text-white bg-purple-600 hover:bg-purple-700">

Post

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

saveProducts();

renderTable();

renderCards();

overlay.remove();

};

}



/* ----------------------- EVENTS ----------------------- */

productBody.addEventListener("click", e => {

if (e.target.classList.contains("postBtn")){
  Swal.fire({
    title: "Post Product",
    html:`
    <h2></h2>
    <p><p>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
    `,
    preConfirm: ()=>{}
  }).then()
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