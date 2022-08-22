// iremos usar duas variáveis para substituir o queryselector e queryselectorall, para simplificar o código
const c = (el)=> document.querySelector(el);
const cs = (el)=> document.querySelectorAll(el);
// a variável abaixo foi criada para quando abrirmos o modal, a quantidade das pizzas sejam padronizadas em um.
let cart = [];
let modalqtd = 1; 
let modalkey = 0;


//Parâmetros da função map, que é uma função que irá percorrer o array
//O parâmetro item (pode ser dado qualquer nome) é obrigatório e representa o próprio item da interação atual. Ou seja, à medida que a função map itera sobre o array, esse parâmetro receberá cada item.
//O parâmetro index é opcional e representa o índice do item da iteração atual.

//Listagem das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = c('.models .pizza-item').cloneNode(true); // a função cloneNode(true), pegará a estrutura que está no HTML e clonará.
    //preencher as informações em pizza-item, que está na div de classe models, que não aparece no HTML, pois seu display está none. e depois da declaração da variável inserimos uma variável c para substituir o queryselector.


    pizzaItem.setAttribute('data-key', index); // o setAttribute irá setar o atributo para o pizzaItem o atributo data-key com o valor index.
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = item.price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;    
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;  
    // abaixo será adcionado um evento de click nos ítens da pizza e também ua função prevent.Default(), para ele não atualizar a página ao ser clicado
    pizzaItem.querySelector('a').addEventListener('click', (e)=>{
        e.preventDefault(); // o e.preventDefault(), serve para cancelar a atualização da página quando clicamos no elemente que tem a tag a, que no caso não tem nenhum link, e fica atualizando a página.
        
        let key = e.target.closest('.pizza-item').getAttribute('data-key');// o e.target irá marcar o elemento, e com closest  é utilizado porque ele vai selecionar pra cima, e o css sempre seleciona para baixo, que no caso é pizza-item, e com o getAttribute, ele quer dizer o seguinte, receba o atributo que está entre parenteses que no caso é o ('data-key'), que irá informar a localização do objeto correspondente aquele item dentro do pizzaJson
        
        //Sempre que o usuário abrir o modal, mesmo que ele já tenha aberto e alterado a quantidade, ele irá resetar a quantidade, para 1.
        modalqtd = 1;
        modalkey = key;

        //para inserir as informações no modal pode ser da maneira que fizemos mais acima para inserir na página, ou dessa maneira abaixo, usando pizzaJson[key]
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description; 
        c('.pizzaBig img').src = pizzaJson[key].img; 
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
            if(sizeIndex == 2){
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });
        c('.pizzaInfo--qt').innerHTML = modalqtd;

        //para exibir o modal de forma mais suave, primeiro setamos o style com a opacidade em 0, e depois setamos o display flex para ele ser exibido na tela, mas com o style com a opacidade 0, e depois setamos o style com a opacidade 1, e com um setTimeout setado em 200 miléssimos. Como no exemplo abaixo
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = "flex";
        setTimeout(()=>{
            c('.pizzaWindowArea').style.opacity = 1;
        },200);
        //Retirando o botão de subir tela ao abrir o modal
        c('.pizzaWindowArea').style.display = "flex";
        document.querySelector('.top_btn').style.display = 'none';
    });
    


    //a classe pizza-area irá receber as informações do pizza-item, através da variável pizzaItem. Depois da declaração da variável inserimos uma variável c para substituir o queryselector.
    c('.pizza-area').append(pizzaItem);

});

//Eventos do modal 

 //função de fechar o modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;

    setTimeout(()=>{
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
    //eventos de fechar o modal clicando no cancelar da web e mobile
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=>{
    item.addEventListener('click', closeModal);
});

//Alterando a quantidade de pizza do modal

c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
    if(modalqtd > 1) {
        modalqtd--;
        c('.pizzaInfo--qt').innerHTML = modalqtd;

    }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
        modalqtd++;
        c('.pizzaInfo--qt').innerHTML = modalqtd;

});

// Selecionar os tamanhos da pizzas marcando onde for clicado e desmarcando onde tava selecionado

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', ()=>{
        
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
        // acima poderia ser usado o e.target.classList.add('selected'); em horas que vc precisa pegar o elemento que ativou o evento dinâmicamente, ou não sabe quem é esse elemento, ai o event.target ajuda bastante, mas nesses casos onde se conhece o elemento, tanto faz.

    //Setando o valor das pizzas de acordo com o tamanho
    if(sizeIndex == 0) {
        pricenew = pizzaJson[modalkey].price * 0.5;
        c('.pizzaInfo--actualPrice').innerHTML = pricenew.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
        
    } else if (sizeIndex == 1) {
        pricenew = pizzaJson[modalkey].price * 0.7;
        c('.pizzaInfo--actualPrice').innerHTML = pricenew.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }else(
        c('.pizzaInfo--actualPrice').innerHTML = pizzaJson[modalkey].price.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
    
            
    )

    })
})

// Adcionando a pizza no carrinho
c('.pizzaInfo--addButton').addEventListener('click', ()=>{
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identifier = pizzaJson[modalkey].id+'@'+size; //  esse idenficador vai varrer o Array e setar qual id e tamanho.

    let key = cart.findIndex((item)=>item.identifier == identifier); //professor está fazendo é verificar se o identifier que foi montado a partir da pizza sendo cadastrada já existe dentro do carrinho através da função findIndex que vai retornar -1 se o item não existir, e se existir vai trazer a posição dela no array.

    // então ele faz um if que valida se a posição encontrada (key) é maior do que -1 (ou seja existe), e usa isso para acessar esse item no carrinho e atualizar a quantidade dessa pizza que foi pedida.
    if(key > -1) {
        cart[key].qt += modalqtd;
    } 
    //Se for -1 ele só cadastra ela no carrinho através de cart.push.
    else {
        cart.push({
            identifier,
            id:pizzaJson[modalkey].id,
            size,
            qt:modalqtd
        })
    }
    
    updateCart() //A função foi inserida aqui, para atualizar o carrinho antes de fechar o modal, mas poderia também ficar depois da função closeModal(), que ele atualizaria assim que o modal fosse fechado
    closeModal();
});

c('.menu-openner').addEventListener('click', ()=> {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', ()=> {
    c('aside').style.left = '100vw';
    
});

//Função de atualizar o carrinho (cart)
function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = ''; //Isso quer dizer que sempre que atualizar o painel ele escreve um HTML em branco no carrinho, ou seja, ele limpa o que está lá. E depois a função vai preencher de novo com a nova informação. Sem isso toda vez que você comprar uma nova pizza ele vai escrever tudo de novo, o que você já tinha comprado e o que você acabou de comprar. Vai gerar redundancia. 

        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=>item.id == cart[i].id);
            

            let cartItem = c('.models .cart--item').cloneNode(true);
            
            //Inserindo descrição e os preços de acordo com tamanho das pizzas 
            let newPrice;
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    newPrice = pizzaItem.price * 0.5;
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    newPrice = pizzaItem.price * 0.7;
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    newPrice = pizzaItem.price
                    break
            }

            subtotal += newPrice * cart[i].qt
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click',()=>{
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                } else {
                    cart.splice(i, 1);
                }
                updateCart();
            });

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click',()=>{
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);
        }

        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;

        

    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }

    
    
    
}



// finalilzando a compra

c('.cart--finalizar').addEventListener('click', ()=> {
    
    c('.finishedArea').style.opacity = 0;
        c('.finishedArea').style.display = "flex";
        setTimeout(()=>{
            c('.finishedArea').style.opacity = 1;
        },200);
    
   c('.finalizar').style.display = 'flex';
})

c('.finishedButton').addEventListener('click', ()=> {
    c('.finishedArea').style.opacity = 0;

    setTimeout(()=>{
        c('.finishedArea').style.display = 'none';
        
        cart = []

        if(cart.length < 1) {
            c('aside').classList.remove('show');
            c('.cart').innerHTML = '';
            c('.menu-openner span').innerHTML = cart;
            c('aside').style.left = '100vw';
            subtotal = 0;
            desconto = 0;
            total = 0;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}`;
        }
        
         
        
    }, 500);

   
})

function topscreen() {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
    }); 
}

 function decidirbotaoscroll() {
    if(window.scrollY === 0 || c('.pizzaWindowArea').style.display == 'flex' || c('aside').style.left == '0px' ) {
        
        document.querySelector('.top_btn').style.display = 'none';
        
    } 
    else {
        
        document.querySelector('.top_btn').style.display = 'flex';
        
    }
}


window.addEventListener('scroll', decidirbotaoscroll); 
