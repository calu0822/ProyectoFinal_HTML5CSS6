var resultado = null;

var filtrado = null;

$(document).ready(function() {

    const socket = new WebSocket('wss://ws.bitmex.com/realtime');

    socket.onopen = event => {
        const apiCall = {
            'op': 'subscribe',
            'args': [`orderBookL2_25:XBTUSD`]
        };

        console.log('Inicia socket', event);
        socket.send(JSON.stringify(apiCall));
    };

    socket.onmessage = event => {
        const json = JSON.parse(event.data);
        
    
        if (json.action === 'partial' || json.action === 'insert') {
            filtrado = json.data.find(row => row.side === 'Buy');
            console.log('mensaje recibido filtrado', filtrado);
            if (filtrado) {
                $('.valores-moneda').text(`USD$ ${filtrado.price}`);
                $('.label-moneda').text(`Cryptomoneda: ${filtrado.symbol}`);
            }
        }   
    };
    
    socket.onerror = event => {
        console.log('error recibido', event);
    };
    
    
    $.ajax({
        url: 'https://dragon-ball-super-api.herokuapp.com/api/characters',
        
        success: function(res) {
            resultado = res;
            console.log('data :>> ', res);
            
            let cards = '';
            let precioCOL = 0;

            res.forEach(usr => {
                
                const card = `
                    <div class="card">
                        <div class="img-card">
                            <img src="${usr.imageUrl}" alt="${usr.name}" class="img">
                        </div>
                        <div class="info-card">
                            <h2 class="name-card"><span class="color-h">Nombre:</span > ${usr.name} </h2>
                            <h4 class="name-card"><span class="color-h">Rol:</span> ${usr.role} </h4>  
                            <h4 class="name-card"><span class="color-h">Planeta:</span> ${usr.originplanet} </h4> 
                            <h4 class="name-card"><span class="color-h">Especie:</span> ${usr.specie} </h4> 
                            <h4 class="name-card"><span class="color-h">Precio: </span> COL$ ${precioCOL = generateRandomInt(50000,100000)}</h4> 
                            <h4 class="name-card"><span class="color-h">Precio USD:</span> USD$ ${convertirCOL_USD(precioCOL)} </h4>
                                                                                        
                        </div>
                    </div>`;

                    cards += card;
            });                                  

            //$('.container-ajax').append(cards);
            //$('.container-ajax').html(cards);
            $('.flex-padre').html(cards);

        },
        error: function(err) {
            console.log('err :>> ', err);
        }
    })
    .done(function() {
        console.log('Finaliza ejecucion del ajax');
    });
    






    const nombre = document.getElementById('nombre');
    const email = document.getElementById('email');
    const comentarios = document.getElementById('comentarios');
    const form = document.getElementById('form');
    const parrafo = document.getElementById('warnings');


    form.addEventListener("submit", e=>{
        e.preventDefault();
        let warnings = "";
        let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        let entrar = false;
        parrafo.innerHTML = "";
        if(nombre.value.length < 6){
            warnings += `El nombre no es valido <br>`;
            alert("Nombre muy corto");
            entrar = true;
        }
        //console.log(regexEmail.test(email.value));
        if(!regexEmail.test(email.value)){
            warnings += `El email no es valido <br>`;
            entrar = true;
        }
        if(comentarios.value.length < 20){
            warnings += `EL mensaje debe tener al menos 20 caracteres <br>`;
            entrar = true;
        }
        if(entrar){
            parrafo.innerHTML = warnings;
        }else{
            parrafo.innerHTML = "Enviado";

        }
    });



    function generateRandomInt(min,max){
        return Math.floor((Math.random() * (max-min)) +min);
    }

    function convertirCOL_USD(valor){
        let USD = valor/4426;
        return USD.toFixed(2);
    }



});



