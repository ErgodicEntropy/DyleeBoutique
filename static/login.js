document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    try {

        const email = document.getElementById("userEmail").value.trim().toLowerCase();
        const password = form.elements["password"].value;
        const rememberMe = form.querySelector("input[type='checkbox']").checked;
    
        if (!email || !password) {
          alert("Please fill in all fields");
          return;
        }
    
        const users = JSON.parse(localStorage.getItem("users")) || [];
    
        const hashPassword = (password) => {
          return btoa(password);
        };
    
        const user = users.find(user => user.email === email);
    
        if (!user) {
          Swal.fire({
                icon:"error",
                text:"No account found with this email",
                title:"Oops...",
                timer:2000,
                timerProgressBar:true
            })

          return;
        }
    
        if (user.password !== hashPassword(password)) {
            Swal.fire({
                icon:"error",
                text:"Incorrect password",
                title:"Oops...",
                timer:2000,
                timerProgressBar:true
            })

          return;
        }
    
        const sessionUser = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName
        };
    
        if (rememberMe) {
          localStorage.setItem("currentUser", JSON.stringify(sessionUser));
        } else {
          sessionStorage.setItem("currentUser", JSON.stringify(sessionUser));
        }
    
        Swal.fire({
            icon:"success",
            text:"Login successful!",
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