/*
    Affichage des informations d'un canapé en affichant pour chacun une couleur par ligne
    calcul le prix des articles en fonction des quantités sélectionnées
*/
displayProducts = (productsLocalStorage, option) => {

    console.log("displayProducts")

    if (option == "refresh") {        

        //Supprime tous les enfant d'un élément
        var element = document.getElementById("cart__items")
        while (element.firstChild) {
            //console.log(element.firstChild)
            element.removeChild(element.firstChild)
        }
    }

    let htmlContent

    productsLocalStorage.forEach(function(product){

        htmlContent = `
            <article class="cart__item" data-id="${product.id}">

                <div class="cart__item__img">
                    <h2>${product.name}</h2>
                    <img src="${product.imageUrl}" alt="${product.altTxt}" />
                </div>

                <div class="cart__content">
        `
        product.details.forEach(function(details){

            htmlContent += `
                    <div class="cart__item__content">
                        <div class="cart__item__content__description">
                            <p>${details.color}</p>
                            <p class="pricequantity">${product.price * details.quantity} €</p>
                            <div class="cart__item__content__settings">
                                <div class="cart__item__content__settings__quantity">
                                    <p>Qté : ${details.quantity}</p>
                                    <input data-price="${product.price}" data-color="${details.color}" type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${details.quantity}" />
                                </div>
                                <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem" data-id="${product.id}" data-color="${details.color}">Supprimer</p>
                                </div>
                            </div>
                        </div>
                    </div>
            `
        })
        htmlContent += `
                </div>

            </article>
            `
        document.querySelector('#cart__items').insertAdjacentHTML('afterbegin', htmlContent)
    })
}

const getProductValueLocalStorage = (productId) => {
    console.log("getProductValueLocalStorage")
    const valueLocalStorage = JSON.parse(localStorage.getItem(productId))
    return valueLocalStorage
}

const setProductValueLocalStorage = (productId, valueLocalStorage) => {
    console.log("setProductValueLocalStorage")
    let valueLocalStorageStringified = JSON.stringify(valueLocalStorage)
    localStorage.setItem(productId, valueLocalStorageStringified)
}


//Retourne un tableau d'objets contenant les informations des produits et de la commande imbriqués
const getAllProductsDataLocalStorage = (products) => {
    let order = new Array
    let productsDatasOrder = new Array

    for (let i=0; i<localStorage.length; i++) {
        
        let idLocalStorage = localStorage.key(i)
        let valueLocalStorage = JSON.parse(localStorage.getItem(idLocalStorage))

        //On récupère toutes les informations des produits présents dans le local storage en faisant matcher leur ID avec celui de la BDD
        let productsDataOrder = products.find(function(val, index) {
            if (val._id == idLocalStorage) return val
        })

        order = {
            id : idLocalStorage,
            altTxt : productsDataOrder.altTxt,
            description : productsDataOrder.description,
            imageUrl : productsDataOrder.imageUrl,
            name : productsDataOrder.name,
            price : productsDataOrder.price,
            details : valueLocalStorage
        }

        productsDatasOrder.push(order)
    }
    return productsDatasOrder
}

changeProductQuantity = (productsLocalStorage, elementsQuantity) => {

    console.log("changeProductQuantity demandé !")

    for (const element of elementsQuantity) {

        element.addEventListener('click', () => {

            let productColor = element.getAttribute("data-color")
            const productId = element.closest(".cart__item").getAttribute("data-id")
            let ProductValueLocalStorage = new Array
            ProductValueLocalStorage = getProductValueLocalStorage(productId)
            
            console.log("ProductValueLocalStorage", ProductValueLocalStorage)

            let index = ProductValueLocalStorage.findIndex(function(todo, index) {
                return todo.color == productColor
            })

            newProductDetail = {
                color : productColor,
                quantity : element.value
            }

            ProductValueLocalStorage.splice(index, 1, newProductDetail)

            console.log("ProductValueLocalStorage", ProductValueLocalStorage)

            setProductValueLocalStorage(productId, ProductValueLocalStorage)

            
            displayProducts(productsLocalStorage, "init")

        })
    }
}

/*
    Met à jour les prix de la page
*/
updatePrices = (productsLocalStorage, element) => {
    const productId = element.closest(".cart__item").getAttribute("data-id")
    const productPrice = getProductPrice(productId, productsLocalStorage)
    const newPrice = element.getAttribute("data-price") * element.value
    
    console.log("updatePrices")
    console.log("productsLocalStorage : ", productsLocalStorage)
    //console.log("element : ",element.getAttribute("data-price"))
    console.log("newPrice", newPrice)
    console.log(element.closest(".cart__item").getAttribute("data-id"))
    //getProductData
    //element.closest(".pricequantity").textContent = newPrice+" €"
    //element.setAttribute("value", newPrice)
}

const getProductPrice = (productId, productsLocalStorage) => {
    console.log("getProductPrice")
    for (const element of productsLocalStorage) {
        console.log(element)
    }
}

/*
    Supprime un enregistrement losrqu'on clique sur le texte "Supprimer"
    - Si 1 seule couleur est présente pour 1 canapé, on supprime tout le bloc image du canapé + commande
    - Si plusieurs couleurs sont renseignées, on ne supprime que la ligne concernée
    - Les informations du localStorage sont mise à jour
*/
_deleteOrder = () => {
    console.log("deleteOrder")
    let deleteLinks = document.getElementsByClassName("deleteItem")

    for (let i=0; i < deleteLinks.length; i++) {

        deleteLinks[i].onclick = function () {
            deleteLinks = document.getElementsByClassName("deleteItem")
            let idProductSelected = this.getAttribute("data-id")
            let colorProductSelected = this.getAttribute("data-color")
            let getValueFromLocalStorage = localStorage.getItem(idProductSelected)
            let valueLocalStorage = JSON.parse(getValueFromLocalStorage)
            let indexRowColor
            let getParentCardNode
            
            indexRowColor = valueLocalStorage.findIndex(row =>row.color == colorProductSelected)
            
            //Si l'utilisateur supprime le produit avec 1 seule couleur
            if (valueLocalStorage.length == 1) {
                this.closest(".cart__item").remove()
                localStorage.removeItem(idProductSelected)
            
            //Si l'utilisateur supprime le produit avec plusieurs couleurs
            }else{
                valueLocalStorage.splice(indexRowColor, 1)
                getParentCardNode = this.closest(".cart__item__content")
                getParentCardNode.remove()
                localStorage.removeItem(idProductSelected)
                
                //Order.setOrder(idProductSelected, valueLocalStorage) - A FAIRE
                let OrderValueStringified = JSON.stringify(valueLocalStorage)
                localStorage.setItem(idProductSelected, OrderValueStringified)
            }
        }
    }
}

deleteOrder = () => {       
    let deleteElement = document.getElementsByClassName("deleteItem")

    for (const element of deleteElement) {

        element.addEventListener('click', () => {
            console.log("deleteOrder")
            
            let productContainer = element.closest(".cart__item")

            if (productContainer.hasChildNodes()) {
                let children = productContainer.childNodes
              
                for (const node of children) {
                  console.log("node", node)
                  //element.removeChild(element.firstChild)
                }
              }

            //console.log("rowToDelete", rowToDelete)
        })
    }
    /*
    //Supprime tous les enfant d'un élément
    var element = document.getElementById("cart__items")
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
    */
}

updatePrices = () => {
    console.log("updatePrices")
    const productsPrices = document.getElementsByClassName("pricequantity")
    const totalPrice = document.getElementById("totalPrice")
    
    let productPriceCleaned = 0

    for (const productNode of productsPrices) {
        productPriceCleaned = productPriceCleaned + parseInt(productNode.innerHTML.substring(0, productNode.innerHTML.length - 2))
    }
    console.log("TOTAL PRIX : ", productPriceCleaned)
    totalPrice.innerHTML = productPriceCleaned
}

updateQuantities = () => {
    console.log("updateQuantities")
    const totalQuantity = document.getElementById("totalQuantity")
    const productsQuantity = document.getElementsByClassName("itemQuantity")
    
    let productQuantityCleaned = 0

    for (const productNode of productsQuantity) {
        productQuantityCleaned = productQuantityCleaned + parseInt(productNode.value.substring(0, productNode.value.length))
    }
    console.log("TOTAL QUANTITES : ", productQuantityCleaned)
    totalQuantity.innerHTML = productQuantityCleaned
}

_checkForm = (inputFirstName, inputLastName, inputAdress, inputCity, inputEmail) => {

    console.log("checkForm")

    let isValid = false

    if (inputFirstName.name == "firstName") {
        //'^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$'
        let FirstNameRegExp = new RegExp('[a-zA-Z][^0-9]')
        let testFirstName = FirstNameRegExp.test(inputFirstName.value)

        if(testFirstName) {
            element.nextElementSibling.innerHTML = ""
            console.log("Prénom valide")
            isValid = true
        }else{
            element.nextElementSibling.innerHTML = "Prénom invalide"
            console.log("Prénom non valide")
            isValid = false
        }
    }
    if (inputLastName.name == "lastName") {
        let lastNameRegExp = new RegExp('[a-zA-Z][^0-9]')
        let testLastName = lastNameRegExp.test(inputLastName.value)

        if(testLastName) {
            element.nextElementSibling.innerHTML = ""
            console.log("Nom valide")
            isValid = true
        }else{
            element.nextElementSibling.innerHTML = "Nom invalide"
            console.log("Nom non valide")
            isValid = false
        }
    }
    if (inputAdress.name == "address") {
        let addressRegExp = new RegExp('[a-zA-Z0-9]')
        let testAddress = addressRegExp.test(inputAdress.value)

        if(testAddress) {
            element.nextElementSibling.innerHTML = ""
            console.log("Adresse valide")
            isValid = true
        }else{
            element.nextElementSibling.innerHTML = "Adresse invalide"
            console.log("Adresse non valide")
            isValid = false
        }
    }
    if (inputCity.name == "city") {
        let cityRegExp = new RegExp('[a-zA-Z]')
        let testcity = cityRegExp.test(inputCity.value)

        if(testcity) {
            element.nextElementSibling.innerHTML = ""
            console.log("Ville valide")
            isValid = true
        }else{
            element.nextElementSibling.innerHTML = "Ville invalide"
            console.log("Ville non valide")
            isValid = false
        }
    }
    if (inputEmail.name == "email") {
        //'^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$'
        let emailRegExp = new RegExp('[a-zA-Z0-9]')
        let testEmail = emailRegExp.test(inputEmail.value)

        if(testEmail) {
            element.nextElementSibling.innerHTML = ""
            console.log("Adresse valide")
            isValid = true
        }else{
            element.nextElementSibling.innerHTML = "Adresse invalide"
            console.log("Adresse non valide")
            isValid = false
        }
    }
    return isValid
}

const main = async () => {

    //Enregistrement en dur pour les tests - A supprimer
    //localStorage.setItem('8906dfda133f4c20a9d0e34f18adcf06', '[{"color":"Grey","quantity":"1"},{"color":"Purple","quantity":"1"},{"color":"Blue","quantity":"2"}]')
    //localStorage.setItem('a6ec5b49bd164d7fbe10f37b6363f9fb', '[{"color":"Pink","quantity":"2"},{"color":"Brown","quantity":"3"},{"color":"Yellow","quantity":"3"},{"color":"White","quantity":"3"}]')
    //localStorage.setItem('034707184e8e4eefb46400b5a3774b5f', '[{"color":"Silver","quantity":"3"}]')
    
    //Récupération des données de tous les produits présents dans la BDD
    const productsData = await getMockedData("")
    
    //Récupération de toutes les informations des produits présents dans le local storage
    const productsLocalStorage = getAllProductsDataLocalStorage(productsData)
    
    //Affichage des produits 
    displayProducts(productsLocalStorage, "init")
    
    const elementsQuantity = document.getElementsByClassName("itemQuantity")
    changeProductQuantity(productsLocalStorage, elementsQuantity)

    //order.setPricebyProduct()
    deleteOrder()

    updatePrices()
    updateQuantities()

    /*************** Ecouter le clic sur le submit du formulaire ***************/

    const formInputs = document.querySelectorAll('#formUser input[type=text], #formUser input[type=email]')

    formUser.addEventListener('submit', function (event) {
        //Empêche le formulaire d'être exécuté
        event.preventDefault()
        isValid = checkForm(formInputs)
        console.log("isValid form response : ", isValid)
    })

    checkForm = (formInputs) => {
        let inputRegExp
        let testInput    
        let isValid = true
        for (const formInput of formInputs) {
            if (formInput.name == "firstName" || formInput.name == "lastName") inputRegExp = new RegExp('[a-zA-Z][^0-9]')
            if (formInput.name == "adress") inputRegExp = new RegExp('[a-zA-Z0-9]')
            if (formInput.name == "city") inputRegExp = new RegExp('[a-zA-Z][^0-9]')
            if (formInput.name == "email") inputRegExp = new RegExp('[a-zA-Z][^0-9]')
                
            testInput = inputRegExp.test(formInput.value)    
            if(testInput) {
                formInput.nextElementSibling.innerHTML = ""
                console.log(formInput.name+" valide")
            }else{
                formInput.nextElementSibling.innerHTML = formInput.name+" invalide"
                console.log(formInput.name+" invalide")
                isValid = false
            }
            /*
            const r = fetch('https://jsonplaceholder.typicode.com/todos/1')
            console.log(r)

            fetch('https://jsonplaceholder.typicode.com/todos/1')
                .then(response => response.json())
                .then(json => console.log(json))
            */
        }
        return isValid
    }

    let contact = {
        /*firstName : firstName,
        lastName : lastName,
        address : address,
        city : city,
        email : email,
        products : []*/
        firstName : "test",
        lastName : "test",
        address : "1 rue du test",
        city : "Ville-test",
        email : "unemail@testemail.com"
    }

    let products = ["034707184e8e4eefb46400b5a3774b5f"]

    //console.log("products : ", contact, products)

    let response = await fetch('http://localhost:3000/api/order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(contact, products)
      });
      
      let result = await response.json();
      alert(result.message);

    /*
    async function fetchProducts() {
        const res = await fetch('http://localhost:3000/api/order', {
            method: 'POST',
            headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({contact, products})
        })
        .then(res => res.json())
        
        if (res.ok === true) {
            return res.json
        }else{
            throw new Error('Impossible de contexter le server')
        }
        
    }
    await fetchProducts().then(users => console.log(users))
*/
    /*
    ('https://jsonplaceholder.typicode.com/users')
        .then(r => r.json())
        .then(body => console.log(body))
        */

        function makeJsonData() {
            let contact = {
              firstName: prenom.value,
              lastName: nom.value,
              address: adresse.value,
              city: ville.value,
              email: mail.value,
            };
            let items = getCart();
            let products = [];
          
            for (i = 0; i < items.length; i++) {
              if (products.find((e) => e == items[i][0])) {
                console.log("not found");
              } else {
                products.push(items[i][0]);
              }
            }
            let jsonData = JSON.stringify({ contact, products });
            return jsonData;
          }
}

main()