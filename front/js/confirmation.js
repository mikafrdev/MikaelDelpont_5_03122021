const urlPage = window.location
const url = new URL(urlPage)
const id = url.searchParams.get("id")
const orderId = document.getElementById("orderId")
orderId.innerHTML = id