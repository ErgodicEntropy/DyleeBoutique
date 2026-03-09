async function readImage(imageFile){
  return new Promise((resolve, reject)=>{

    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result);
    
    reader.onerror = error => reject(error);

    reader.readAsDataURL(imageFile);
  })    
}

const name = document.getElementById('name'); //required (name includes version)
const size = document.getElementById('size') || "";
const category = document.getElementById('category') || ""; 
const brand = document.getElementById('brand') || ""; 
const cost  = document.getElementById('cost'); //required
cost.addEventListener('change', ()=>{
  price.placeholder = 2*parseFloat(cost.value) + " DH" + " " + "(minimum)";
})
const price = document.getElementById('price') || 2*cost; //the estimated pric 
// a price tracking/market research API to estimate market equilibrium price
const stock = document.getElementById('stock') || 1; //stock is the quantity of the product (in cards, it is substituted by availability status)
const imageFile = document.getElementById('image') || null;

const productForm = document.getElementById('productForm'); 

let image;

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (imageFile.files.length > 0){ //check if the image is uploaded
      image = await readImage(imageFile.files[0]); 
      // const URL = URL.createObjectURL(imageFile.files[0]);
      console.log("addproductimage", image);
    } else {
      console.log("null image file!");
      return; //makes the image input required
    }

    const data = {
      name: name.value.trim(),
      size: size.value.trim(),
      category: category.value.trim(),
      brand: brand.value.trim(),
      cost: cost.value.trim(),
      price: price.value.trim(),
      stock: stock.value.trim(),
      image: image
    };

    if (!data){
    console.log("empty data");
    }

    window.localStorage.setItem("productdata", JSON.stringify(data))

    Swal.fire({
      icon: "success",
      title: "Add",
      text: "Product Added!",
      timer: 2000,
      timerProgressBar: true
    });

    setTimeout(()=>{
      window.location.href = './products.html';
    }, 3000)
  });


const uploadForm = document.getElementById("uploadForm");
const fileInput = uploadForm.querySelector("input[type='file']");

uploadForm.addEventListener("submit", function(e){
  e.preventDefault();

  const file = fileInput.files[0];

  if(!file){
  Swal.fire("Error","Please select a JSON file","error");
  return;
  }

  const reader = new FileReader();

  reader.onload = function(event){

  try{

  const product = JSON.parse(event.target.result);

  /* Fill the manual form fields */

  document.getElementById("name").value = product.name || "";
  document.getElementById("size").value = product.size || "";
  document.getElementById("category").value = product.category || "";
  document.getElementById("brand").value = product.brand || "";
  document.getElementById("cost").value = product.cost || "";
  document.getElementById("price").value = product.price || "";
  document.getElementById("stock").value = product.stock || "";

  /* Image from JSON (if stored as base64) */
  if(product.image){
    document.getElementById("image").dataset.uploadedImage = product.image;
  }

  /* Trigger the manual form submit */
  productForm.requestSubmit();

  Swal.fire(
  "Product Loaded",
  "JSON product imported successfully",
  "success"
  );

  }catch(err){

  Swal.fire(
  "Invalid File",
  "JSON format is incorrect",
  "error"
  );

  }

  };

  reader.readAsText(file);

});