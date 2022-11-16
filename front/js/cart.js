/*
    Affichage des informations d'un canapé en affichant pour chacun une couleur par ligne
    calcul le prix des articles en fonction des quantités sélectionnées
*/
displayProducts = (productsLocalStorage, option) => {

    console.log("displayproductsDatas")

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

            //displayProducts(productsLocalStorage, "refresh")

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
}

main()
