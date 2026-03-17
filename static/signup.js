document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    try{

    const firstName = document.getElementById("firstname").value.trim();
    const lastName = document.getElementById("lastname").value.trim();
    const email = form.elements["email"].value.trim().toLowerCase();
    const password = form.elements["password"].value;

    if (!firstName || !lastName || !email || !password) {
      Swal.fire({
        icon:"info",
        text:"Please fill in all fields",
        title:"Oops...",
        timer:2000,
        timerProgressBar:true
      })
      return;
    }

    if (password.length < 6) {
      Swal.fire({
        icon:"info",
        text:"Password must be at least 6 characters",
        title:"Oops...",
        timer:2000,
        timerProgressBar:true
      })
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      Swal.fire({
        icon:"info",
        text:"Account already exists with this email",
        title:"Oops...",
        timer:2000,
        timerProgressBar:true
      })
      return;
    }

    // Simple hash function (NOT secure, but better than plain text)
    const hashPassword = (password) => {
      return btoa(password); // base64 encoding
    };

    const newUser = {
      id: Date.now(),
      firstName,
      lastName,
      email,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify({
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName
    }));

    Swal.fire({
        icon:"success",
        text:"Account created successfully!",
        title:"Sign Up",
        timer:2000,
        timerProgressBar:true
      })
      
    window.location.href = "home.html";
    }catch(err){
      Swal.fire({
        icon:"error",
        text:err.message,
        title:"Oops...",
        timer:2000,
        timerProgressBar:true
      })
    }


  });

});