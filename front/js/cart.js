/*
    Récupération des données mockées d'un produit
    - Si aucun paramètre n'est passé alors on affiche tous les produits
    - Si un ID est renseigné en paramètre alors on affiche uniquement les données d'un produit

*/
getMockedData = async (productID) => {

    let canap = await fetch('http://localhost:3000/api/products/' + productID)
    .then((response) => {
        if (response.ok) {
            //console.log("Réponse ok du server")
            return response.json()
        }else{
            console.log("Problème server")
        }
    })
    .then((data) => { 
        //console.log('Success:', data)
        //return data

        //Récupération de toutes les informations des produits présents dans le local storage
        const productsLocalStorage = getAllProductsDataLocalStorage(data)

        console.log("productsLocalStorage : ", productsLocalStorage)

        //Affichage des produits 
        displayProducts(productsLocalStorage, "init")

        return productsLocalStorage

    })
    .catch((error) => { console.error('Error:', error) })

    return canap
}

/*
    Affichage des informations d'un canapé en affichant pour chacun une couleur par ligne
    calcul le prix des articles en fonction des quantités sélectionnées
*/
displayProducts = (productsLocalStorage, option) => {

    console.log("displayProducts")

    /*
    if (option == "refresh") {

        //Supprime tous les enfant d'un élément
        var element = document.getElementById("cart__items")
        while (element.firstChild) {
            //console.log(element.firstChild)
            element.removeChild(element.firstChild)
        }
    }
    */

    let htmlContent

    productsLocalStorage.forEach(function (product) {

        htmlContent = `
            <article class="cart__item" data-id="${product.id}">

                <div class="cart__item__img">
                    <h2>${product.name}</h2>
                    <img src="${product.imageUrl}" alt="${product.altTxt}" />
                </div>

                <div class="cart__content">
        `
        product.details.forEach(function (details) {

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

    for (let i = 0; i < localStorage.length; i++) {

        let idLocalStorage = localStorage.key(i)
        let valueLocalStorage = JSON.parse(localStorage.getItem(idLocalStorage))

        //On récupère toutes les informations des produits présents dans le local storage en faisant matcher leur ID avec celui de la BDD
        let productsDataOrder = products.find(function (val, index) {
            if (val._id == idLocalStorage) return val
        })

        order = {
            id: idLocalStorage,
            altTxt: productsDataOrder.altTxt,
            description: productsDataOrder.description,
            imageUrl: productsDataOrder.imageUrl,
            name: productsDataOrder.name,
            price: productsDataOrder.price,
            details: valueLocalStorage
        }

        productsDatasOrder.push(order)
    }
    return productsDatasOrder
}

changeProductQuantity = (productsLocalStorage, elementsQuantity) => {

    console.log("changeProductQuantity demandé !")

    for (const element of elementsQuantity) {

        element.addEventListener('click', function () {

            /*
            let productColor = element.getAttribute("data-color")
            const productId = element.closest(".cart__item").getAttribute("data-id")
            let ProductValueLocalStorage = new Array
            ProductValueLocalStorage = getProductValueLocalStorage(productId)

            console.log("ProductValueLocalStorage", ProductValueLocalStorage)

            let index = ProductValueLocalStorage.findIndex(function (todo, index) {
                return todo.color == productColor
            })

            newProductDetail = {
                color: productColor,
                quantity: element.value
            }

            ProductValueLocalStorage.splice(index, 1, newProductDetail)

            console.log("ProductValueLocalStorage", ProductValueLocalStorage)

            setProductValueLocalStorage(productId, ProductValueLocalStorage)
            */

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

    for (let i = 0; i < deleteLinks.length; i++) {

        deleteLinks[i].onclick = function () {
            deleteLinks = document.getElementsByClassName("deleteItem")
            let idProductSelected = this.getAttribute("data-id")
            let colorProductSelected = this.getAttribute("data-color")
            let getValueFromLocalStorage = localStorage.getItem(idProductSelected)
            let valueLocalStorage = JSON.parse(getValueFromLocalStorage)
            let indexRowColor
            let getParentCardNode

            indexRowColor = valueLocalStorage.findIndex(row => row.color == colorProductSelected)

            //Si l'utilisateur supprime le produit avec 1 seule couleur
            if (valueLocalStorage.length == 1) {
                this.closest(".cart__item").remove()
                localStorage.removeItem(idProductSelected)

                //Si l'utilisateur supprime le produit avec plusieurs couleurs
            } else {
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
                    //console.log("node", node)
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

const main = async () => {

    //Enregistrement en dur pour les tests - A supprimer
    //localStorage.setItem('8906dfda133f4c20a9d0e34f18adcf06', '[{"color":"Grey","quantity":"1"},{"color":"Purple","quantity":"1"},{"color":"Blue","quantity":"2"}]')
    //localStorage.setItem('a6ec5b49bd164d7fbe10f37b6363f9fb', '[{"color":"Pink","quantity":"2"},{"color":"Brown","quantity":"3"},{"color":"Yellow","quantity":"3"},{"color":"White","quantity":"3"}]')
    //localStorage.setItem('034707184e8e4eefb46400b5a3774b5f', '[{"color":"Silver","quantity":"3"}]')

    //Récupération des données de tous les produits présents dans la BDD
    const productsLocalStorage = await getMockedData("")

    const elementsQuantity = document.getElementsByClassName("itemQuantity")
    changeProductQuantity(productsLocalStorage, elementsQuantity)

    //order.setPricebyProduct()
    deleteOrder()

    updatePrices()
    updateQuantities()

    /*************** Ecouter le clic sur le submit du formulaire ***************/

    const formInputs = document.querySelectorAll('#formUser input[type=text], #formUser input[type=email]')

    formUser.addEventListener('submit', function (event) {
        event.preventDefault()  //Empêche le formulaire d'être exécuté
        isValid = checkForm(formInputs)

        if (isValid) {
            fetchPostOrder()
        }
        console.log("isValid form response ?", isValid)
    })

    checkForm = (formInputs) => {
        let inputRegExp
        let testInput
        let isValid = true

        for (const formInput of formInputs) {
            if (formInput.name == "firstName" || formInput.name == "lastName") {
                inputRegExp = new RegExp('[a-zA-Z0-9à-üÀ-Ü-\'\s]')
            }
            if (formInput.name == "adress") {
                inputRegExp = new RegExp('([0-9a-zA-Z,\. ]*) ?([0-9]{5}) ?([a-zA-Z]*)')
            }
            if (formInput.name == "city") {
                //[a-zA-Z0-9à-üÀ-Ü-\'\s]
                inputRegExp = new RegExp('/^[a-zA-Z.\'-]+(?:[\s-][\/a-zA-Z.]+)*$/gm')
            }
            if (formInput.email == "email") {
                //(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))
                //^.+@.+\..+
                //^([a-zA-Z0-9_-])+([.]?[a-zA-Z0-9_-]{1,})*@([a-zA-Z0-9-_]{2,}[.])+[a-zA-Z]{2,3}$
                inputRegExp = new RegExp('^([a-zA-Z0-9_-])+([.]?[a-zA-Z0-9_-]{1,})*@([a-zA-Z0-9-_]{2,}[.])+[a-zA-Z]{2,3}$')
            }

            testInput = inputRegExp.test(formInput.value)

            if (testInput) {
                formInput.nextElementSibling.innerHTML = ""
                console.log(formInput.name + " valide")
            } else {
                formInput.nextElementSibling.innerHTML = formInput.name + " invalide"
                console.log(formInput.name + " invalide")
                isValid = false
            }
        }
        return isValid
    }

    fetchPostOrder = () => {
        let contact = {
            firstName: "test",
            lastName: "test",
            address: "1 rue du test",
            city: "Ville-test",
            email: "unemail@testemail.com"
        }

        let products = ["034707184e8e4eefb46400b5a3774b5f"]

        let fetchPostUrl = "http://localhost:3000/api/products/order"
        let fetchBody = { contact, products }

        console.log(JSON.stringify(fetchBody))

        fetch(fetchPostUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            body: JSON.stringify(fetchBody)
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log("Problème server")
                }
            })
            .then((data) => {
                console.log('Success:', data)
                //document.location.href="confirmation.html?orderId="+data.orderId
                return data
            })
            .catch((error) => {
                console.error('Error:', error)

            })
    }
    //fetchPostOrder()

} //END MAIN

main()