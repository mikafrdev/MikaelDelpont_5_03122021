const retrieveKanapMockedData = () => fetch('http://localhost:3000/api/products')
    .then(res => res.json())
    //.then(data => console.log(data))
    .catch(err => console.log("Oh no", err))

const displayKanaps = (kanapsData) => {

    for(const val in kanapsData){

        //Création du noeud <a>
        const node_A = document.createElement("a")
        node_A.setAttribute("href", "./product.html?id="+kanapsData[val]._id)

        const node_ARTICLE = document.createElement("article")
        node_A.appendChild(node_ARTICLE)

        const node_IMG = document.createElement("img")
        node_IMG.setAttribute("src", kanapsData[val].imageUrl)
        node_IMG.setAttribute("alt", kanapsData[val].altTxt)
        node_ARTICLE.appendChild(node_IMG)

        const node_H3 = document.createElement("h3")
        node_H3.setAttribute("class", "productName")
        node_H3.textContent = kanapsData[val].name
        node_ARTICLE.appendChild(node_H3)

        const node_P = document.createElement("p")
        node_P.setAttribute("class", "productDescription")
        node_P.textContent = kanapsData[val].description
        node_ARTICLE.appendChild(node_P)

        document.getElementById("items").appendChild(node_A)

    }

}

const main = async () => {
    const kanapsData = await retrieveKanapMockedData()
    displayKanaps(kanapsData)
}

main()