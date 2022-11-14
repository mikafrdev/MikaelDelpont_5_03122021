/*
    Affichage des informations d'un canapé en affichant pour chacun une couleur par ligne
    calcul le prix des articles en fonction des quantités sélectionnées
*/
displayProducts = (productsData, option) => {

    console.log("displayproductsDatas")

    if (option == "refresh") {        
        
        //Supprime tous les enfant d'un élément
        var element = document.getElementById("cart__items")
        while (element.firstChild) {
            //console.log(element.firstChild)
            element.removeChild(element.firstChild)
        }
    }

    let htmlContent

    productsData.forEach(function(product){

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

/*

*/
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

changeProductQuantity = (productsLocalStorage) => {
    const elementsQuantity = document.getElementsByClassName("itemQuantity")
    for (const element of elementsQuantity) {

        element.addEventListener('change', () => {

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

            displayProducts(productsLocalStorage, "refresh")

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
deleteOrder = () => {
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

//Work in progress
_setPricebyProduct = () => {
    const changeProductsPrice = document.getElementsByClassName("deleteItem")
    changeProductsPrice.forEach(element => {
        console.log("TEST : ", changeProductsPrice[element])
    })
}

//BUG
_onClickAddQuantity = () => {
    const changeProductQuantity = document.getElementsByClassName("itemQuantity")

    for (let i = 0; i < changeProductQuantity.length; i++) {
        changeProductQuantity[i].onclick = function () {

            let currentProductBasicPrice = this.getAttribute("data-price")
            let newProductPriceQuantity = currentProductBasicPrice * this.value
            this.parentNode.firstElementChild.innerHTML = "Qté : "+this.value

            //A VOIR AVEC DIDIER
            let productsFromLocalStorage = this.getProductsFromLocalStorage()
            let countColorProductsFromLocalstorage = 0
            
            for (let j = 0; j < productsFromLocalStorage.length; j++) {
                for (let k = 0; k < productsFromLocalStorage[j].color.length; k++) {
                    countColorProductsFromLocalstorage += parseInt(productsFromLocalStorage[j].color[k].quantity)
                }
            }

            //changeProductQuantity[i].closest(".cart__item__content__description").children[1].innerHTML = newProductPriceQuantity+" €"
            document.getElementById("totalQuantity").innerHTML = countColorProductsFromLocalstorage
        }
    }
}

//WIP...
getQuantityFromLocalStorage = (Products) => {

}

//Work in progress
setOrder = (id, NewOrderValue) => {
    JSON.stringify(OrderValueStringified)
    let OrderValueStringified = JSON.stringify(NewOrderValue)
    localStorage.setItem(id, OrderValueStringified)
}

//Récupère le contenu du local storage sous la forme d'un tableau d'objets
_getProductsFromLocalStorage = () => {
    let productsFromLocalStorage = new Array
    let idLocalStorage
    let i = 0
    for (let i=0; i<localStorage.length; i++) {
        idLocalStorage = localStorage.key(i)
        //console.log("Test : "+JSON.parse(localStorage.getItem(idLocalStorage)))
        productsFromLocalStorage.push({
            id : localStorage.key(i),
            color: JSON.parse(localStorage.getItem(idLocalStorage))
        })
    }
    //console.log(productsFromLocalStorage)
    return productsFromLocalStorage
}

//Work in progress ...
getProductValueFromLocalStorage = (orderValueLS) => {
    let i = 0
    while (i < orderValueLS.length) {

        if ( colorChoice == orderValueLS[i].color ) return i
        i++
    }
    return -1
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

    //test
    changeProductQuantity(productsLocalStorage)

    //Début gestion des prix
    //const changeProductQuantity = document.getElementsByClassName("itemQuantity")

    /*
    for (let i = 0; i < changeProductQuantity.length; i++) {
        changeProductQuantity[i].onclick = function () {

            console.log("Click change quantity")

            
            let _id = this.closest("article").getAttribute("data-id")
            let colorChoice = this.closest("article").getAttribute("data-color")

            let valueLocalStorageById = JSON.parse(localStorage.getItem(_id))

            const _index = valueLocalStorageById.findIndex(object => {
                console.log(object.color)
                console.log(colorChoice)
                return object.color == colorChoice
            })

            console.log(valueLocalStorageById)

            const index = valueLocalStorageById.map(object => object.color).indexOf(colorChoice)

            console.log("indexColorRow : "+index)
            

            
            while () {
                i++
            }
            
            
            let newValueLocalStorage = {

            }

            //newOrderValue = {color: colorChoice, quantity: quantityChoice}
            //valueLocalStorage.push(NewOrderValue)
            //localStorage.setItem('myCat', 'Tom')

            
            productsFromLocalStorage.push({
                id : localStorage.key(i),
                color: JSON.parse(localStorage.getItem(idLocalStorage))
            })
            
            //order.addOrder(productsDataPage)

            
            let currentProductBasicPrice = this.getAttribute("data-price")
            let newProductPriceQuantity = currentProductBasicPrice * this.value
            this.parentNode.firstElementChild.innerHTML = "Qté : "+this.value

            let productsFromLocalStorage = order.getProductsFromLocalStorage()
            let countColorProductsFromLocalstorage = 0
            
            for (let j = 0; j < productsFromLocalStorage.length; j++) {
                for (let k = 0; k < productsFromLocalStorage[j].color.length; k++) {
                    countColorProductsFromLocalstorage += parseInt(productsFromLocalStorage[j].color[k].quantity)
                }
            }

            //changeProductQuantity[i].closest(".cart__item__content__description").children[1].innerHTML = newProductPriceQuantity+" €"
            document.getElementById("totalQuantity").innerHTML = countColorProductsFromLocalstorage
            
        }
    }
    */

    //Fin gestion des prix

    //order.setPricebyProduct()
    deleteOrder()
}

main()
