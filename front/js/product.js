const queryString = window.location.search
const searchID = new URLSearchParams(queryString)
const isIDinQuery = searchID.get('id')
const productID = searchID.get('id')

const retrieveKanapMockedData = async (productID) => fetch('http://localhost:3000/api/products/' + productID)
    .then(res => res.json())
    .catch(err => console.log("Erreur fetch", err))

const addOrder = (Product) => {

    console.log("addOrder")

    console.log(Product)

    const colorChoice = document.getElementById('colors').value
    const nbProductChoice = document.getElementById('quantity').value

    if (colorChoice != "" && nbProductChoice != 0) {

        console.log("Formulaire valide")

        let Order = {
            id: Product._id,
            color: colorChoice,
            quantity: nbProductChoice
        }

        console.log(Order.id)

        orderKeyStringified = JSON.stringify(Order["id"])
        OrderValueStringified = JSON.stringify(Order)

        //includes renvoie TRUE ou FALSE
        //isOrderInChart = getLocaStorageKeys().includes(orderKeyStringified)
        const getLocaStorageKeys = []
        const localStorageLength = localStorage.length
        let i = 0
    
        //Si aucun enregistrement n'est présent dans localStorage
        if (!localStorage.getItem(Order["_id"])) {
            localStorage.setItem(Order["_id"], OrderValueStringified)
            console.log("Enregistrement effectué !")
        
        //Si des enregistrements sont présents
        }else{
            while (i < localStorageLength) {
                getLocaStorageKeys[i] = JSON.parse(localStorage.getItem(localStorage.key(i)));
                
                console.log(getLocaStorageKeys[i])

                //Si l'enregistrement est déjà présent
                if( colorChoice == getLocaStorageKeys[i].color && nbProductChoice == getLocaStorageKeys[i].quantity ) {
                    Order["quantity"]++
                    
                    //Suppression de l'enregistrement
                    localStorage.removeItem(localStorage.key(i))

                    localStorage.setItem()

                    alert("L'enregistrement a déjà été mis à jour !")
                
                //Si l'enregistrement n'est pas présent
                }else{
                    localStorage.setItem(orderKeyStringified, OrderValueStringified)
                    console.log("Enregistrement effectué !")
                }
                i++
            }
        }

    }else{

        alert("Formulaire non valide")
    }
}

const getOrder = () => {
    if ( localStorage.getItem('userScribble') ) {
        var scribble = localStorage.getItem('userScribble');
    }
    else {
        var scribble = 'You can scribble directly on this sticky... and I will also remember your message the next time you visit my blog!';
    }
    document.getElementById('scribble').innerHTML = scribble;
}

const clearOrder = () => {
    localStorage.clear();
    return false;
}

const test = (OrderKey) => {
    console.log("getLocaStorageKeys")

    const getLocaStorageKeys = []
    const localStorageLength = localStorage.length
    console.log(localStorageLength)
    let i = 0

    //Si aucun enregistrement n'est présent dans localStorage
    if (localStorageLength == 0) {

    }
    
}
    
    

    //console.log("test : "+getLocaStorageKeys[0].name)

    //isOrderInChart = getLocaStorageKeys.includes(orderKeyStringified)

const displayProduct = (Product) => {

    console.log("displayProduct")

    const node_IMGcnt =  document.getElementsByClassName('item__img')
    const node_IMG = document.createElement("img")
    node_IMG.setAttribute("src", Product.imageUrl)
    node_IMG.setAttribute("alt", Product.altTxt)
    node_IMGcnt[0].appendChild(node_IMG)

    const node_h1 =  document.getElementById('title')
    node_h1.textContent = Product.name

    const node_price =  document.getElementById('price')
    node_price.textContent = Product.price

    const node_description =  document.getElementById('description')
    node_description.textContent = Product.description

    const node_select =  document.getElementById('colors')
    
    for(const color in Product.colors){
        const node_option = document.createElement("option")
        node_option.setAttribute("value", Product.colors[color])
        node_option.textContent = Product.colors[color]
        node_select.appendChild(node_option)
    }

}

const main = async () => {
    const Product = await retrieveKanapMockedData(productID)

    /*
    Product = {
        altTxt : kanapData.altTxt,
        color: kanapData.color,
        description : kanapData.description,
        id : kanapData.id,
        imageUrl : kanapData.imageUrl,
        name: kanapData.nappme,
        price : kanapData.prpice,
        quantity: kanapData.quantity
    }
    
    const Order = {
        id: kanapData._id,
        color: document.getElementById('colors').value,
        quantity: document.getElementById('quantity').value
    }
    */
    
    displayProduct(Product)

    //Au clic sur le bouton "Ajouter au panier"
    document.getElementById("addToCart").onclick = function() {
        addOrder(Product)
    }
}

main()