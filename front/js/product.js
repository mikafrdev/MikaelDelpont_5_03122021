//Affiche le produit passé en paramètre en produisant du code HTML
displayProduct = (product) => {        

    const node_IMGcnt =  document.getElementsByClassName('item__img')
    const node_IMG = document.createElement("img")
    node_IMG.setAttribute("src", product.imageUrl)
    node_IMG.setAttribute("alt", product.altTxt)
    node_IMGcnt[0].appendChild(node_IMG)

    const node_h1 =  document.getElementById('title')
    node_h1.textContent = product.name

    const node_price =  document.getElementById('price')
    node_price.textContent = product.price

    const node_description =  document.getElementById('description')
    node_description.textContent = product.description

    const node_select =  document.getElementById('colors')
    
    for(const color in product.colors){
        const node_option = document.createElement("option")
        node_option.setAttribute("value", product.colors[color])
        node_option.textContent = product.colors[color]
        node_select.appendChild(node_option)
    }
}

//On vérifie qu'une couleur et qu'un nombre d'article ont bien été sélectionnés
isValideForm = () => {
    
    let colorSelected = document.getElementById("colors").value
    let quantitySelected = document.getElementById("quantity").value

    if (colorSelected == "" || quantitySelected == 0) {
        return false
    }else{
        return true
    }
}

//On vérifie que la couleur de l'article est déjà présente dans le localStorage sinon on renvoie -1
isColorStillOrdered = (orderValueLS, colorChoice) => {

    let i = 0
    while (i < orderValueLS.length) {

        if ( colorChoice == orderValueLS[i].color ) return i
        i++
    }
    return -1
}

checkOrder = () => {
    console.log("checkOrder")
    if (this.colorSelected != "" && this.quantitySelected != 0) {

        console.log("Formulaire valide")
    }else{
        console.log("Formulaire KO : PB sélection couleur ou quantité")
    }
}

const getIdFromUrl = () => {
    const queryString = window.location.search
    const searchID = new URLSearchParams(queryString)
    const productID = searchID.get('id')

    return productID
}

const main = async () => {

    //localStorage.setItem('107fb5b75607497b96722bda5b504926', '{"colors":["Blue","green"],"quantity":["3"]}')
    //localStorage.setItem('107fb5b75607497b96722bda5b504926', '{"orders":{"colors":"Red","quantity":"3"}}')    
    
    //On récupère les données du produit en passant en paramètre l'ID présente dans l'url
    const productData = await getMockedData(getIdFromUrl())
    
    //On affiche les données du produit
    displayProduct(productData)
    
    //On initialise la fonction qui se déclenche au clic sur le bouton "Ajouter au panier"
    document.getElementById("addToCart").onclick = function() {
        setOrder(productData)
    }
}

main()