/*
    Récupération de toutes les informations des articles présents dans le local storage en les complétant avec les informations de la BDD

    Paramètre :
    productsMocked => Tableau d'objets contenant toutes les informations des articles de la BDD
    Exemple :
    [
        {
            "colors": [
                "Blue",
                "White",
                "Black"
            ],
            "_id": "107fb5b75607497b96722bda5b504926",
            "name": "Kanap Sinopé",
            "price": 1849,
            "imageUrl": "http://localhost:3000/images/kanap01.jpeg",
            "description": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            "altTxt": "Photo d'un canapé bleu, deux places"
        },
        ...
    ]
*/
const getProductsMerged = (productsMocked) => {
    let order = new Array
    let productsMerged = new Array

    //Boucle sur tous les éléments du local storage
    for (let i = 0; i < localStorage.length; i++) {
        let idLocalStorage = localStorage.key(i)
        let valueLocalStorage = JSON.parse(localStorage.getItem(idLocalStorage))

        //On identifie l'ID de l'article correspondant dans la base de donnée afin d'y récupérer toutes les informations
        let productsDataOrder = productsMocked.find(element => element._id == idLocalStorage)

        //Création d'un objet article avec toutes ses informations
        productAllData = {
            id: idLocalStorage,
            altTxt: productsDataOrder.altTxt,
            description: productsDataOrder.description,
            imageUrl: productsDataOrder.imageUrl,
            name: productsDataOrder.name,
            price: productsDataOrder.price,
            details: valueLocalStorage
        }

        //Ajout de l'article et de ses informations dans le tableau productsMerged
        productsMerged.push(productAllData)
    }
    return productsMerged
}

/*
    Retourne un tableau avec les informations {color, quantity} d'un produit dans le local storage
    Exemple :
    [
        {color: 'Pink', quantity: '8'},
        {color: 'Brown', quantity: '4'},
        ...
    ]

    Paramètres :
    productId => ID d'un article
*/
const getProductValueLocalStorage = (productId) => {
    const valueLocalStorage = JSON.parse(localStorage.getItem(productId))
    return valueLocalStorage
}

/*
    Met à jour le local storage avec le duo clé-valeur :
    KEY => productId
    VALUE => valueLocalStorage

    Paramètres :
    productId => ID d'un article  <numérique>
    valueLocalStorage => Tableau d'objets contenant la paire {color, quantity}
    Exemple :
    [
        {color: 'Pink', quantity: '8'},
        {color: 'Brown', quantity: '4'},
        ...
    ]
*/
const setProductValueLocalStorage = (productId, valueLocalStorage) => {
    let valueLocalStorageStringified = JSON.stringify(valueLocalStorage)
    localStorage.setItem(productId, valueLocalStorageStringified)
}

/*
    Affichage des articles qui ont été enregistrés dans le local storage
    
    Paramètres :
    productsMocked => Tableau contenant tous les articles présents dans la BDD
    productsMerged => Tableau contenant uniquement les articles présents dans le local storage auxquels on a ajouté toutes les informations relatives et présentes dans la BDD
    option => Si option = "refresh", efface tous les articles de la page ce qui permet de mettre à jour l'affichage suite à des modification de quantité ou des suppression d'articles réalisés par l'internaute
*/
displayProducts = (productsMocked, productsMerged, option) => {    
    //Supprime tous les articles affichés dans la page
    if (option == "refresh") {
        var e = document.getElementById("cart__items")
        var child = e.lastElementChild
        
        while (child) {
            e.removeChild(child)
            child = e.lastElementChild
        }
    }

    const node_parent = document.getElementById('cart__items')

    //Si au moins 1 article est présent dans la local storage
    if (productsMerged.length) {
        productsMerged.forEach(function (product) {
            const node_article = document.createElement("article")
            node_article.setAttribute("class", "cart__item")
            node_article.setAttribute("data-id", product.id)
            node_parent.appendChild(node_article)

            let node_div = document.createElement("div")
            node_div.setAttribute("class", "cart__item__img")
            node_article.appendChild(node_div)

            let node_h2 = document.createElement("h2")
            node_h2.innerHTML = product.name
            node_div.appendChild(node_h2)

            node_img = document.createElement("img")
            node_img.setAttribute("src", product.imageUrl)
            node_img.setAttribute("alt", product.altTxt)
            node_div.appendChild(node_img)

            node_container_details = document.createElement("div")
            node_container_details.setAttribute("class", "cart__content")
            node_article.appendChild(node_container_details)

            product.details.forEach(function (details) {
                node_div = document.createElement("div")
                node_div.setAttribute("class", "cart__item__content")
                node_div.setAttribute("data-id", product.id)
                node_div.setAttribute("data-color", details.color)
                node_container_details.appendChild(node_div)

                const node_div_2 = document.createElement("div")
                node_div_2.setAttribute("class", "cart__item__content__description")
                node_div.appendChild(node_div_2)

                let node_p = document.createElement("p")
                node_p.innerHTML = details.color
                node_div_2.appendChild(node_p)

                node_p = document.createElement("p")
                node_p.setAttribute("class", "pricequantity")
                node_p.innerHTML = product.price * details.quantity + " €"
                node_div_2.appendChild(node_p)

                node_div_3 = document.createElement("div")
                node_div_3.setAttribute("class", "cart__item__content__settings")
                node_div_2.appendChild(node_div_3)

                let node_div_4 = document.createElement("div")
                node_div_4.setAttribute("class", "cart__item__content__settings__quantity")
                node_div_3.appendChild(node_div_4)

                let node_p_quantite = document.createElement("p")
                node_p_quantite.innerHTML = "Qté : " + details.quantity
                node_div_4.appendChild(node_p_quantite)

                const node_input = document.createElement("input")
                node_input.setAttribute("data-price", product.price)
                node_input.setAttribute("data-color", details.color)
                node_input.setAttribute("type", "number")
                node_input.setAttribute("class", "itemQuantity")
                node_input.setAttribute("name", "itemQuantity")
                node_input.setAttribute("min", "1")
                node_input.setAttribute("max", "100")
                node_input.setAttribute("value", details.quantity)
                node_div_4.appendChild(node_input)

                node_div_4 = document.createElement("div")
                node_div_4.setAttribute("class", "cart__item__content__settings__delete")
                node_div_3.appendChild(node_div_4)

                node_p_supprimer = document.createElement("p")
                node_p_supprimer.setAttribute("class", "deleteItem")
                node_p_supprimer.setAttribute("data-id", product.id)
                node_p_supprimer.setAttribute("data-color", details.color)
                node_p_supprimer.innerHTML = "Supprimer"
                node_div_4.appendChild(node_p_supprimer)
            })
        })
    //Si aucun article est présent dans la local storage, affichage d'un message utilisateur
    }else{
        node_message = document.createElement("div")
        node_message.setAttribute("class", "cart__item")
        node_message.innerHTML = "Votre panier est vide, merci d'ajouter des articles pour pouvoir passer une commande."
        node_parent.appendChild(node_message)
    }

    //Initialisation des évènements relatifs au nouvel affichage
    changeProductQuantity(productsMocked)
    updateQuantities()
    updatePrices()
    deleteOrder(productsMocked)
}

/*  
    En changeant la quantité d'un article, le local storage est mis à jour et l'affichage des articles est rafraichi 

    Paramètres :
    productsMocked => Tableau contenant tous les articles présents dans la BDD
*/
changeProductQuantity = (productsMocked) => {
    //Récupération de tous les input qui gèrent les quantités des articles
    const elementsQuantity = document.getElementsByClassName("itemQuantity")

    //Boucle pour créer un évènement click sur chaque input quantity
    for (const element of elementsQuantity) {
        element.addEventListener('click', function () {  

            const productColor = element.getAttribute("data-color")            
            const productId = element.closest(".cart__item").getAttribute("data-id")
            let ProductValueLocalStorage = new Array

            //Récupération des informations {color, quantity} dans le local storage de l'article 
            ProductValueLocalStorage = getProductValueLocalStorage(productId)

            //Retourne l'index d'où se trouve la couleur correspondante du tableau ProductValueLocalStorage
            const index = ProductValueLocalStorage.findIndex(element => element.color == productColor)

            newProductDetail = {
                color: productColor,
                quantity: element.value
            }

            //Mise à jour de la nouvelle quantité dans le tableau ProductValueLocalStorage à l'aide de l'objet newProductDetail
            ProductValueLocalStorage.splice(index, 1, newProductDetail)
            
            setProductValueLocalStorage(productId, ProductValueLocalStorage)
            const productsMerged = getProductsMerged(productsMocked)
            displayProducts(productsMocked, productsMerged, "refresh")
        })
    }
    
}

/*
    Supprime un enregistrement losrqu'on clique sur le texte "Supprimer"
    - Si 1 seule couleur est présente pour 1 canapé, on supprime tout le bloc image du canapé + commande
    - Si plusieurs couleurs sont renseignées, on ne supprime que la ligne concernée
    - Les informations du localStorage sont mise à jour

    Paramètre :
    productsMocked => Tableau contenant tous les articles présents dans la BDD
*/
deleteOrder = (productsMocked) => {
    //Récupération de tous les éléments "Supprimer"
    let deleteElement = document.getElementsByClassName("deleteItem")

    //Boucle pour créer un évènement click sur chaque élément "Supprimer"
    for (const element of deleteElement) {
        element.addEventListener('click', () => {
            let productId = element.getAttribute("data-id")
            let productColor = element.getAttribute("data-color")
            let valueLocalStorage = getProductValueLocalStorage(productId)
            let indexRowColor = valueLocalStorage.findIndex(row => row.color == productColor)   //Retourne l'index de la couleur correspondante d'un article dans le localstorage

            //Si l'utilisateur supprime le produit avec 1 seule couleur
            if (valueLocalStorage.length == 1) {
                localStorage.removeItem(productId)
            } else {    //Si l'utilisateur supprime le produit avec plusieurs couleurs
                valueLocalStorage.splice(indexRowColor, 1)  //Retourne un tableau correspondant à la couleur + quantité d'un article depuis le local storage, ici on supprime la couleur
                setProductValueLocalStorage(productId, valueLocalStorage)
            }
            let productsMerged = getProductsMerged(productsMocked)
            displayProducts(productsMocked, productsMerged, "refresh")
        })
    }
}

//Mise à jour du total des prix de la commande des articles
updatePrices = () => {
    const productsPrices = document.getElementsByClassName("pricequantity")
    let totalPrice = 0

    for (const productNode of productsPrices) {
        //Calcul de tous les prix, on formate au préalable la chaine de caractère pour permettre le calcul en supprimant l'unité et l'espace " €" afin de ne garder que le prix
        totalPrice = totalPrice + parseInt(productNode.innerHTML.substring(0, productNode.innerHTML.length - 2))
    }
    document.getElementById("totalPrice").innerHTML = totalPrice
}

//Mise à jour du total des quantités
updateQuantities = () => {
    const productsQuantity = document.getElementsByClassName("itemQuantity")
    let totalQuantity = 0

    for (const productNode of productsQuantity) {
        totalQuantity = totalQuantity + parseInt(productNode.value)
    }
    document.getElementById("totalQuantity").innerHTML = totalQuantity
}


/*
    Réalise la validation de la commande    

    Paramètre :
    contact => Objet contenant les informations saisies par l'internaute dans le formulaire
*/
fetchPostOrder = (contact) => {
    //Récupération de l'id des produits
    let products = new Array
    for (let [key] of Object.entries(localStorage)) {
        products.push(key)
    }

    let fetchPostUrl = "http://localhost:3000/api/products/order"
    let fetchBody = { contact, products }

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
            document.location.href="confirmation.html?orderId="+data.orderId
            //return data
        })
        .catch((error) => {
            console.error('Error:', error)
        })
}

const main = async () => {
    //Récupération des données de tous les produits présents dans la BDD
    const productsMocked = await getMockedData()

    //Récupération de toutes les informations des articles dans le local storage en les complétant avec les informations de la BDD
    const productsMerged = getProductsMerged(productsMocked)
    displayProducts(productsMocked, productsMerged) //Affichage des produits 

    formUser.addEventListener('submit', function (event) {
        event.preventDefault()  //Empêche le formulaire d'être exécuté
        let isValidForm = true
        let isValidRegExp
        let contact = new Object
        
        let RegExpList = {
            firstName : /^[a-zA-Zà-üÀ-Ü]+[a-zA-Zà-üÀ-Ü-\'\s]*[a-zA-Zà-üÀ-Ü]+$/,
            lastName : /^[a-zA-Zà-üÀ-Ü]+[a-zA-Zà-üÀ-Ü-\'\s]*[a-zA-Zà-üÀ-Ü]+$/,
            address : /^[a-zA-Z0-9à-üÀ-Ü]+[a-zA-Z0-9à-üÀ-Ü\s%'"-&*,.\/]*[a-zA-Z0-9à-üÀ-Ü]+$/,
            city : /^[a-zA-Zà-üÀ-Ü]+[a-zA-Zà-üÀ-Ü\s%'"\-&*,.\/]*[a-zA-Zà-üÀ-Ü]+$/,
            email : /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+.([A-Za-z]{2,4})$/
        }

        //Test de chaque champ du formulaire avec sa regExp associée
        for (const regExp in RegExpList) {
            element = document.getElementById(regExp)
            inputRegExp = new RegExp(RegExpList[regExp])
            isValidRegExp = inputRegExp.test(element.value)
            
            if (isValidRegExp) {
                element.nextElementSibling.innerHTML = ""
                contact[regExp] = element.value
            } else {
                element.nextElementSibling.innerHTML = element.name + " invalide"
                isValidForm = false
            }
        }
        if (isValidForm) fetchPostOrder(contact)
    })

} //END MAIN

main()