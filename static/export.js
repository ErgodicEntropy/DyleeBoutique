const orders = document.getElementById('exportOrders');
if (orders){
    orders.addEventListener('click', async (e) =>{
        e.preventDefault();
        try {
            const { jsPDF } = window.jspdf;
            const table = document.getElementById("tableDiv");
    
            // Use html2canvas to convert table to image
            const canvas = await html2canvas(table, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
    
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "pt",
                format: "a4"
            });
    
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`orders.pdf`); //downloads the file locally
    
            Swal.fire({
                  title: "Export",
                  text: "Your order table exported successfully!",
                  icon: "success"
            });            
    
    
        } catch(err){
            Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: err.message || 'Something went wrong!',
            });
    
        }
    });
}

const products = document.getElementById('exportProducts');
if (products){
    products.addEventListener('click', async (e) =>{
        e.preventDefault();
        try {
            const { jsPDF } = window.jspdf;
            const table = document.getElementById("tableDiv");
    
            // Use html2canvas to convert table to image
            const canvas = await html2canvas(table, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
    
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "pt",
                format: "a4"
            });
    
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`products.pdf`); //downloads the file locally
    
            Swal.fire({
                  title: "Export",
                  text: "Your product table exported successfully!",
                  icon: "success"
            });            
    
    
        } catch(err){
            Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: err.message || 'Something went wrong!',
            });
    
        }
    });
}    

const expenses = document.getElementById('exportExpenses');
if (expenses){
    expenses.addEventListener('click', async (e) =>{
        e.preventDefault();
        try {
            const { jsPDF } = window.jspdf;
            const table = document.getElementById("tableDiv");
    
            // Use html2canvas to convert table to image
            const canvas = await html2canvas(table, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
    
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "pt",
                format: "a4"
            });
    
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`expenses.pdf`); //downloads the file locally
    
            Swal.fire({
                  title: "Export",
                  text: "Your expense table exported successfully!",
                  icon: "success"
            });            
    
    
        } catch(err){
            Swal.fire({
                  icon: 'error',
                  title: 'Oops...',
                  text: err.message || 'Something went wrong!',
            });
    
        }
    });
}    
