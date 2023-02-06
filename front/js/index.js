//Affiche les canapés passés en paramètre en produisant du code HTML
const displayProducts = (productsData) => {

    console.log("displayProducts")
    let htmlContent

    for(const val in productsData){
        htmlContent = `
        <a href="./product.html?id=${productsData[val]._id}">
            <article>
                <img src="${productsData[val].imageUrl}" alt="${productsData[val].altTxt}" />
                <h3 class="productName">${productsData[val].name}</h3>
                <p class="productDescription">${productsData[val].description}</p>
            </article>
        </a>
            `
        document.querySelector('#items').insertAdjacentHTML('afterbegin', htmlContent)
    }
}

const main = async () => {
    
    //Récupération des données de tous les produits avec un argument vide passé en paramètre de la fonction <getMockedData>
    const productsData = await getMockedData()
    
    //Affichage de tous les produits
    displayProducts(productsData)
}

main()