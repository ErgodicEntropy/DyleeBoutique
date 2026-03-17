document.addEventListener("DOMContentLoaded", () => {
    const user =  JSON.parse(localStorage.getItem("currentUser"));

    if (!user){
        Swal.fire({
            icon:"error",
            text:"User not found!",
            title:"Oops...",
            timer:2000,
            timerProgressBar:true
        })
        return;
    }
    
    const es = document.getElementById('emailSpan');
    es.textContent = user.email;

    const ig = document.getElementById('imageSpan'); 
    ig.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=0A8F7A&color=fff&size=32`
});