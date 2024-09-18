function buyNow() {
    var name = document.getElementById("name");
    var price = document.getElementById("price");
  
    var form = new FormData();
    form.append("name", name.innerHTML);
    form.append("price", price.innerHTML);
  
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "process.php", true);
    xhr.onreadystatechange = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
        var data = JSON.parse(xhr.responseText);
  
        payhere.onCompleted = function onCompleted(orderId) {
          console.log("Payment completed. OrderID:" + orderId);
        };
  
        payhere.onDismissed = function onDismissed() {
          console.log("Payment dismissed");
        };
  
        payhere.onError = function onError(error) {
          console.log("Error:" + error);
        };
  
        var payment = {
          sandbox: true,
          merchant_id: data.merchant_id, 
          return_url: undefined, 
          cancel_url: undefined, 
          notify_url: "http://sample.com/notify",
          order_id: data.order_id,
          items: data.name,
          amount: data.price,
          currency: data.currency,
          hash: data.hash, 
          first_name: "Saman",
          last_name: "Perera",
          email: "samanp@gmail.com",
          phone: "0771234567",
          address: "No.1, Galle Road",
          city: "Colombo",
          country: "Sri Lanka",
        };
  
        payhere.startPayment(payment);
      }
    };
    xhr.send(form);
  }