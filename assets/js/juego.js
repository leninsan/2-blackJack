const miModulo=(()=>{
    'use strict'
    let deck = [],
        tipos = ['C','H','D','S'],
        especiales = ['A','J','Q','K'];
        
    // let puntosJugador = 0,
    //     puntosComputadora =0,
    let puntosJugadores= [],
        tipo=0,
        especial=0; 
    //Referencia del HTML
    const botonPedirCarta = document.querySelector('#botonPedirCarta'),
          botonDetener = document.querySelector('#botonDetener'),
          botonNuevo = document.querySelector('#botonNuevo');

    const puntosHtml = document.querySelectorAll('small'),
          jugadorCartas = document.querySelector('#jugador-cartas'),
          computadoraCartas = document.querySelector('#computadora-cartas'),
          visualizarCartas= document.querySelectorAll('.visualizarCartas');

    //Esta funcion inicializa el juego
    const inicializarJuego = (numJugadores=2)=>{
        deck = crearDeck();

        puntosJugadores=[];
        for(let i=0;i<numJugadores;i++){
            puntosJugadores.push(0);
        }
        
        // puntosHtml[0].innerText=0;
        // puntosHtml[1].innerText=0;
        puntosHtml.forEach(elem => elem.innerText= 0);

        visualizarCartas.forEach(elem =>elem.innerText = '');

        botonPedirCarta.disabled= false;
        botonDetener.disabled=false;

    }

    //Esta funcion crea una nueva baraja
    const crearDeck = ()=>{
        deck = [];
        for(let i = 2;i<11 ;i++){
            for (tipo of tipos){
                deck.push(i + tipo)
            }
        }
        for(especial of especiales){
            for (tipo of tipos){
                deck.push(especial + tipo)//insertado valores en un erreglo
            }
        }
        return _.shuffle(deck);//funcion shuffle de la libreria underscore para desordenar un arreglo
    };
    
    // Esta función me permite tomar una carta
    const pedirCarta = ()=> {
        if(deck.length === 0){ 
            throw'No hay más cartas en el deck' //lanzar un error
        };
        return deck.pop();
    }

    const valorCarta =(carta)=>{
        const valor = carta.substring(0,carta.length-1); //extraer los caracteres de un string hasta cierta posicion
        return(isNaN(valor))?  //funcion booleana que no dice si una variable no es un numero
            (valor === 'A')? 11 : 10 
            :valor*1; // volviendo variable "valor" en numero al mutiplicarla por 1 y sumando puntos
    }

    //turno 0= primer jugadro y el ultimo seráeldela computadora
    const acumularPuntos = (carta,turno)=>{
        puntosJugadores[turno] += valorCarta(carta);
        puntosHtml[turno].innerText= puntosJugadores[turno];
        return puntosJugadores[turno];
    }
    const ponerCartas = (carta,turno)=>{
        const imgCarta= document.createElement('img');
        imgCarta.classList.add('carta');
        imgCarta.src= `assets/cartas/${carta}.png`;      
        visualizarCartas[turno].append(imgCarta);
    }
    const quienGana = ()=>{
        const[puntosJugador,puntosComputadora] = puntosJugadores;

        setTimeout(() => {
            (puntosComputadora <=21 && puntosJugador<=21 && puntosComputadora ===21 && puntosJugador===21)?alert('Empate')
            :(puntosJugador === 21 || puntosComputadora>21)?alert('Jugador gana')
            :alert('Computadora gana');   
        }, 30);

    }

    const turnoComputadora = (puntosJugador)=>{
        let puntosComputadora = 0;
        do{
            // pedir cartas para computadora
            const carta = pedirCarta();
            puntosComputadora = acumularPuntos(carta, puntosJugadores.length - 1);
            //visualizar carta de computadora
            ponerCartas(carta,puntosJugadores.length - 1);

            if(puntosComputadora===21 || puntosComputadora===20 || puntosComputadora>21){
                break;
            }
        }while(puntosComputadora <=puntosJugador && puntosJugador <=21);//"puntosJugador <=21" esta condicion es para que la computadora despues de saber que el jugador se pasó de 21 solo gadecida lanzar una carta sabiendo que con eso gana.

        quienGana();

    }

    // ----------------EVENTOS-----------------------------------

    botonPedirCarta.addEventListener('click', ()=>{
            // pedir cartas para jugador
            const cartaJugador = pedirCarta();
            const puntosJugador= acumularPuntos(cartaJugador,0);

            ponerCartas(cartaJugador,0);
            if(puntosJugador>21){
                console.warn('Jugador 1 perdió');
                botonPedirCarta.disabled = true;
                turnoComputadora(puntosJugadores[0]);
            }else if(puntosJugador===21){
                botonPedirCarta.disabled = true;
                turnoComputadora(puntosJugadores[0]);
                console.warn('Has ganado');
            }; 
            
    });

    botonDetener.addEventListener('click',()=>{
        botonPedirCarta.disabled = true;
        turnoComputadora(puntosJugadores[0]);
        botonDetener.disabled= true;
    });

    botonNuevo.addEventListener('click',()=>{

        inicializarJuego();
    })

    return {  // lo que se retorne aqui será lo unico que va a ser publico de mi modulo
        nuevoJuego:inicializarJuego
    };


})();



