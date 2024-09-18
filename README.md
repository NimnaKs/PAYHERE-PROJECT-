# Integrating PayHere Payment Gateway into a PHP Project

This guide provides step-by-step instructions on how to integrate the PayHere Payment Gateway into your PHP project using a sandbox account for testing purposes.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setting Up PayHere Sandbox Account](#setting-up-payhere-sandbox-account)
- [Setting Up the PHP Project](#setting-up-the-php-project)
- [Adding the PayHere Payment Gateway](#adding-the-payhere-payment-gateway)
  - [Frontend Implementation](#frontend-implementation)
  - [Backend Implementation](#backend-implementation)
- [Testing the Payment Gateway](#testing-the-payment-gateway)
- [Notes](#notes)
- [License](#license)

## Prerequisites

- Basic knowledge of PHP and JavaScript
- A web server with PHP installed
- [Visual Studio Code](https://code.visualstudio.com/) or any code editor of your choice

## Setting Up PayHere Sandbox Account

1. **Create or Log Into Sandbox Account**: Visit the [PayHere Sandbox Merchant Portal](https://sandbox.payhere.lk/merchant/sign-in) and create a new account or log into an existing one.

2. **Access the Dashboard**: After logging in, you should see the PayHere sandbox dashboard, confirming that your account is set up correctly.

## Setting Up the PHP Project

1. **Create a New PHP Project**: Initialize a new PHP project directory on your local machine.

2. **Open the Project in VS Code**: Use Visual Studio Code or your preferred editor to open the project directory.

3. **Project Structure**: Your project should contain at least the following files:
   - `index.php` (frontend)
   - `script.js` (JavaScript code)
   - `process.php` (backend processing)

## Adding the PayHere Payment Gateway

### Frontend Implementation

1. **Include PayHere JavaScript Library**: Add the following script tag before the closing `</body>` tag in your `index.php` file:

   ```html
   <script type="text/javascript" src="https://www.payhere.lk/lib/payhere.js"></script>
   ```

2. **Create the HTML Structure**: Use Bootstrap for styling and create a simple product display with a "Buy Now" button.

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>PayHere Integration</title>
       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
   </head>
   <body>
       <div class="container">
           <div class="row">
               <div class="col-12 text-center mt-5">
                   <h4 id="name">iPhone 14 Pro Max</h4>
                   <p>Rs.<span id="price">100</span>.00</p>
                   <button class="btn btn-warning" onclick="buyNow();">Buy Now</button>
               </div>
           </div>
       </div>
       <script type="text/javascript" src="https://www.payhere.lk/lib/payhere.js"></script>
       <script src="script.js"></script>
   </body>
   </html>
   ```

3. **Add the `onclick` Event**: Ensure the "Buy Now" button calls the `buyNow()` function when clicked.

   ```html
   <button class="btn btn-warning" onclick="buyNow();">Buy Now</button>
   ```

### Backend Implementation

1. **Create `process.php`**: This file will process the payment details and generate a hash required by PayHere.

   ```php
   <?php
   $order_id = "1234";
   $merchant_id = "Your_Merchant_ID";
   $name = $_POST["name"];
   $price = $_POST["price"];
   $currency = "LKR";
   $merchant_secret = "Your_Merchant_Secret";

   // Generate the hash
   $hash = strtoupper(
       md5(
           $merchant_id .
           $order_id .
           number_format($price, 2, '.', '') .
           $currency .
           strtoupper(md5($merchant_secret))
       )
   );

   $obj = new stdClass();
   $obj->order_id = $order_id;
   $obj->merchant_id = $merchant_id;
   $obj->name = $name;
   $obj->price = $price;
   $obj->currency = $currency;
   $obj->hash = $hash;

   echo json_encode($obj);
   ?>
   ```

   > **Note**: Replace `Your_Merchant_ID` and `Your_Merchant_Secret` with your actual Merchant ID and Secret obtained from the PayHere dashboard.

2. **Update `script.js`**: Create the `buyNow()` function in `script.js` to handle the payment process.

   ```javascript
   function buyNow() {
     var name = document.getElementById("name").innerText;
     var price = document.getElementById("price").innerText;

     var form = new FormData();
     form.append("name", name);
     form.append("price", price);

     var xhr = new XMLHttpRequest();
     xhr.open("POST", "process.php", true);
     xhr.onreadystatechange = function () {
       if (xhr.readyState === 4 && xhr.status === 200) {
         var data = JSON.parse(xhr.responseText);

         // Payment completed. It can be a successful failure.
         payhere.onCompleted = function onCompleted(orderId) {
           console.log("Payment completed. OrderID:" + orderId);
           // TODO: Validate the payment and show success or failure page to the customer
         };

         // Payment window closed
         payhere.onDismissed = function onDismissed() {
           console.log("Payment dismissed");
           // TODO: Prompt user to pay again or show an error page
         };

         // Error occurred
         payhere.onError = function onError(error) {
           console.log("Error:" + error);
           // TODO: Show an error page
         };

         // Payment details
         var payment = {
           sandbox: true,
           merchant_id: data.merchant_id,
           return_url: undefined,       // Important
           cancel_url: undefined,       // Important
           notify_url: "http://sample.com/notify",
           order_id: data.order_id,
           items: data.name,
           amount: data.price,
           currency: data.currency,
           hash: data.hash,             // Generated hash from the backend
           first_name: "Saman",
           last_name: "Perera",
           email: "samanp@gmail.com",
           phone: "0771234567",
           address: "No.1, Galle Road",
           city: "Colombo",
           country: "Sri Lanka",
         };

         // Initiate the payment
         payhere.startPayment(payment);
       }
     };
     xhr.send(form);
   }
   ```

## Testing the Payment Gateway

1. **Set Sandbox Mode**: Ensure the `sandbox` property in the payment object is set to `true`.

   ```javascript
   var payment = {
     sandbox: true,
     // ... other properties
   };
   ```

2. **Obtain Merchant Credentials**:
   - **Merchant ID**: Found on the PayHere dashboard under your account details.
   - **Merchant Secret**: Found under the "Integrations" section after adding a domain/app.

3. **Add a Domain/App**:
   - Navigate to the "Integration" section in the PayHere dashboard.
   - Click on "Add Domain/App".
   - Select "Domain" and enter your domain name (e.g., `localhost`).
   - Save to generate the Merchant Secret.

   ![Add Domain/App](https://example.com/path-to-your-image/add-domain-app.png)

4. **Update `process.php`**: Replace the placeholders with your actual Merchant ID and Secret.

   ```php
   $merchant_id = "Your_Merchant_ID";
   $merchant_secret = "Your_Merchant_Secret";
   ```

5. **Test Payment**:
   - Use the following test card details provided by PayHere:

     | Card Type   | Card Number         |
     |-------------|---------------------|
     | Visa        | `4916 2175 0161 1292` |
     | MasterCard  | `5307 7321 2553 1191` |
     | AMEX        | `3467 8100 5510 0225` |

   - Enter any future date for the expiration date and any three-digit number for the CVV.

6. **Run the Application**:
   - Start your local web server.
   - Open `index.php` in your browser.
   - Click on the "Buy Now" button to initiate the payment process.

## Notes

- **Hash Generation**: As of January 16, 2023, generating a hash of the payment details is mandatory for security. Always perform hash generation on the server side.

- **Payment Event Handlers**:
  - `payhere.onCompleted`: Triggered when the payment is completed successfully.
  - `payhere.onDismissed`: Triggered when the payment window is closed before completion.
  - `payhere.onError`: Triggered when there is an error during the payment process.

- **Important URLs**:
  - `return_url`: The URL to redirect the customer after a successful payment (set to `undefined` if using the popup method).
  - `cancel_url`: The URL to redirect the customer if the payment is canceled (set to `undefined` if using the popup method).
  - `notify_url`: The URL for server-to-server communication after payment is completed.

- **Security Best Practices**:
  - **Do not expose your Merchant Secret** in client-side code.
  - Always **validate the payment** on your server before fulfilling orders.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Thank you for following this guide!** If you have any questions or encounter issues, feel free to raise them in the project's issue tracker or contact PayHere's support.