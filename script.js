const menu = document.getElementById('menu')
const carrinhoBotao = document.getElementById('carrinho-botao')
const carrinhoAbrir = document.getElementById('carrinho-aberto')
const itemCarrinho = document.getElementById('itens-carrinho')
const precoTotal = document.getElementById('preco-total')
const botaoFechar = document.getElementById('botao-fechar')
const botaoFinalizar = document.getElementById('botao-finalizar')
const botaoAviso = document.getElementById('aviso-endereco')
const qtdCarrinho = document.getElementById('qtd-carrinho')
const endereco = document.getElementById('endereco')

let carrinho = []

//Abrir o carrinho
carrinhoBotao.addEventListener('click', function(){
    carrinhoAbrir.style.display = 'flex'
    mostrarCarrinho()
})

//Fechar o carrinho
carrinhoAbrir.addEventListener('click', function(event){
    if(event.target === carrinhoAbrir){
        carrinhoAbrir.style.display = 'none'
    }
})

botaoFechar.addEventListener('click', function(){
    carrinhoAbrir.style.display = 'none'
})

//pegar os valorees para adicionar no carrinho
menu.addEventListener('click', function(event){
    let botaoParent = event.target.closest('.add-cart-button')

    if(botaoParent){
        const name = botaoParent.getAttribute('data-name')
        const price = parseFloat(botaoParent.getAttribute('data-price'))

        adicionarNoCarrinho(name, price)
    }
})

//função para adicicionar no carrinho
function adicionarNoCarrinho(name, price){
    const existeItem = carrinho.find(item => item.name === name)

   if(existeItem){
    existeItem.quantity +=1;
   }else{
    carrinho.push({
        name,
        price,
        quantity: 1,
      })  
    }

    mostrarCarrinho()
}

//Mostrar no carrinho
function mostrarCarrinho(){
    itemCarrinho.innerHTML = ''
    let total = 0

    carrinho.forEach(item => {
        const carrinhoItemElemento = document.createElement("div")
        carrinhoItemElemento.classList.add("flex", "justify-between", "mb-4", "flex-col")

        carrinhoItemElemento.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
             <p class="font-medium" >${item.name}</p>
             <p>Qtd:${item.quantity}</p>
             <p class="font-medium mt-2" >${item.price.toFixed(2)}</p>
          </div>    
            <button class="remove-button" data-name="${item.name}">
              Remover
            </button>  
        </div>
        `
        total += item.price * item.quantity

        itemCarrinho.appendChild(carrinhoItemElemento)
    })

    precoTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

    qtdCarrinho.innerHTML = carrinho.length
}

//função para remover itens
itemCarrinho.addEventListener('click', function(event){
    if(event.target.classList.contains('remove-button')){
        const name = event.target.getAttribute("data-name")

        removerItem(name)
    }
})

function removerItem(name){
    const index = carrinho.findIndex(item => item.name === name)

    if(index != -1){
        const item = carrinho[index]

        if(item.quantity > 1){
            item.quantity -= 1
            mostrarCarrinho()
            return
        }

        carrinho.splice(index, 1)
        mostrarCarrinho()
    }
}

endereco.addEventListener('input', function(event){
    let enderecoValor = event.target.value

    if(endereco !== ""){
        endereco.classList.remove("border-red-500")
        botaoAviso.classList.add("hidden")
    }
})

//finalizar pedido
botaoFinalizar.addEventListener("click", function(){

     const isOpen = checarRestauranteAberto()
      if(!isOpen){
        if(!isOpen){
            Toastify({
                text: "Ops o restaurante está fechado!",
                duration: 3000,
                close: true,
                gravity: "top", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                  background: "#ef4444",
                },
            }).showToast()

            return;
        }
    }



    if(carrinho.length === 0) return;
    if(endereco.value === ""){
        botaoAviso.classList.remove("hidden")
        endereco.classList.add("border-red-500")
        return;
    }

    //Enviar o pedido para a api do zap
    const itemCarrinho = carrinho.map((item) => {
        return (
            `${item.name} Quantitade: ${item.quantity} Preço: R$${item.price} | `
        )
    }).join("")

    const mensagem = encodeURIComponent(itemCarrinho)
    const phone = "5581989792983"

    window.open(`https://wa.me/${phone}?text=${mensagem} Endereço: ${endereco.value}`, "_blank")

    carrinho = [];
    mostrarCarrinho();
})

//função para verificar horario
function checarRestauranteAberto(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 18 && hora < 22;
}

const  horaSpam = document.getElementById('date-span')
const isOpen = checarRestauranteAberto()

if(isOpen){
    horaSpam.classList.remove("bg-red-500")
    horaSpam.classList.add("bg-green-500")
}else{
    horaSpam.classList.remove("bg-green-500")
    horaSpam.classList.add("bg-red-500")
}