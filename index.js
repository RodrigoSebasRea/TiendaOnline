const listaProductos = [];
const listaCarritos = [];

var cont = JSON.parse(localStorage.getItem("contador")) || "0";
$("#contador").text(cont);
/*
if(cont !=null){
    $("#contador").text(localStorage.getItem("contador"));
}else{
    $("#contador").text("0");
}
*/
//cont !=null ? $("#contador").text(localStorage.getItem("contador")) : $("#contador").text("0");

renderizarProductos(listaProductos);
renderizarCategorias();


$("#CerrarCategorias").on('click',function(){
    renderizarProductos(listaProductos);
    randerizarCarrito()
    $("#Cabecera").text("Nuestros Productos");
    $("#CerrarCategorias").hide();

})


function enviar(idproducto){
    const idprodunicos = [];

    $.get("http://localhost:3000/carrito", (r)=>{
        
        r.forEach((carr)=>{
            idprodunicos.push(carr.id);
            //$(`#quitar${carr.id}`).show();
        });

        console.log(idprodunicos);

        if(idprodunicos.includes(idproducto)){
            alert("Ya registro este producto");
            

        }else{
            //Mensaje
            alert("Producto Agregado");

             //Para el contador
            cont++;
            localStorage.setItem("contador", JSON.stringify(cont));
            $("#contador").text(cont);
            
             //Se buscan y guardan los datos a enviar
            /*var prod = listaProductos.find( valor =>valor.id == idproducto) ;
            var data = { id:prod.id,nombre:prod.nombre, descripcion:prod.descripcion, precio:prod.precio, imagen:prod.imagen};*/

            var {id,nombre,descripcion,precio,imagen} = listaProductos.find( valor =>valor.id == idproducto) ;
            var data = {id,nombre,descripcion,precio,imagen};

            //Se envia a carrito la informacion
            $.ajax({
                    url : 'http://localhost:3000/carrito',
                    data : data, 
                    method : 'post',
                    dataType : 'json',
                    success : function(response){
                        console.log(response);
                        $( `#nose${response.id}` ).prop( "disabled", false ); 
                    },
                    error: function(error){
                        //console.log(error);
                    }
            });

            //Randerizamos la lista
            //renderizarProductos(listaProductos);
            //randerizarCarrito()


        }
    }) 

    console.log(idprodunicos);
}

function Quitar(id){

    if(cont==0){
        //$(`#quitar${idproducto}`).hide();
    }else{
    cont--;
    localStorage.setItem("contador", JSON.stringify(cont));
    $("#contador").text(cont);


    $.ajax({ url: `http://localhost:3000/carrito/${id}`, method: "DELETE" })
            .then(function (data) {
                console.log(id);
                $( `#nose${id}` ).prop( "disabled", true ); 
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    //renderizarProductos(listaProductos);
    //randerizarCarrito()
}

function BotonQuitar(lista){
    for (let index = 0; index < lista.length; index++) {
        //console.log(lista[index].id)
        $( `#nose${lista[index].id}` ).prop( "disabled", false ); 
    }
}

function renderizarProductos(lista){
    let htmlCards = '';
    lista.forEach((producto)=>{

        htmlCards += `
        <div class="card" style="width: 750px;">
              <div class="row no-gutters">
                  <div class="col-sm-5">
                      <img class="card-img" src="${producto.imagen}" alt="Suresh Dasari Card">
                  </div>
                  <div class="col-sm-7">
                      <div class="card-body">
                          <h5 class="card-title">${producto.nombre}</h5>
                          

                          <div class="row col-xl" >
                                <p class="card-text">${producto.descripcion}</p>
                          </div>
                          

                          <div class="row col" >
                                <span id="cantidad" class="badge badge-secondary">${producto.cantidad} Cant.Vendidas</span>
                          </div>

                          <div class="row col" >
                                <div class="stars-outer">
                                <div class="stars-inner ${producto.id}"></div>
                                </div>
                          </div>

                          <div class="row col" >
                                <p style="color:black;font-weight: bold;">S/.${producto.precio}</p>
                          </div>

                          <div  class="row col-md-12">
                          

                          <button id="registrar" onclick="enviar('${producto.id}')" class="btn btn-outline-primary">Registrar</button>
                          <button id="nose${producto.id}" onclick="Quitar('${producto.id}')" class="btn btn-outline-primary">Quitar</button>

                          </div>
                          
                      </div>
                  </div>
              </div>
          </div>
        `
    })

    let contenedorDeProductos = document.getElementById('contenedorProductos');
    contenedorDeProductos.innerHTML = htmlCards;
    valoracionEstrellas();
    
   
}

function valoracionEstrellas(){
    listaProductos.forEach((producto)=>{

        let porcentaje = (valor)=>{
            switch(valor){
                case 1:
                return '20%';
                break;
                case 2:
                return '40%';
                break;
                case 3:
                return '60%';
                break;
                case 4:
                return '80%';
                break;
                case 5:
                return '100%';
                break;
            }
        };

        $( `.stars-inner.${producto.id}` ).css( "width", porcentaje(producto.valoracion) );
        $( `#nose${producto.id}` ).prop( "disabled", true );
 
        //$(`#nose${producto.id}`).hide();
        

    })
}

function renderizarCategorias(){
    let htmlCategorias = '';
    let categoriasRepetidas = [];

    listaProductos.forEach((producto)=>{
        categoriasRepetidas.push(producto.categoria);
    })

    let categoriasUnicas = Array.from(new Set(categoriasRepetidas))


    categoriasUnicas.forEach((valor)=>{

        htmlCategorias += `
        <li>
	            <a href="#" onclick="buscarPorCategoria('${valor}')" >${valor}</a>
	            <ul class="collapse list-unstyled" id="pageSubmenu1"></ul>
	          </li>
        `
    })

    let contenedorCategorias = document.getElementById('contenedorCategorias');
    contenedorCategorias.innerHTML = htmlCategorias;
    $("#CerrarCategorias").hide();
    
    
}



function buscarPorCategoria(categoriaR){
    let productosCategoria = listaProductos.filter(cat => cat.categoria == categoriaR);
    renderizarProductos(productosCategoria);
    $("#Cabecera").text(productosCategoria[0].categoria);
    $("#CerrarCategorias").show();
}


var xmlhttp = new XMLHttpRequest();

xmlhttp.onreadystatechange = ()=>{
    if(xmlhttp.readyState == XMLHttpRequest.DONE){
        if(xmlhttp.status == 200){
            const responseRaw = xmlhttp.responseText;
            const response = JSON.parse(responseRaw);
            //const idProductos = response.id;
            //console.log(response[].id);

            for(var i=0;i<response.length;i++){
                listaProductos.push({
                id: response[i].id,
                nombre: response[i].nombre,
                descripcion: response[i].descripcion,
                categoria: response[i].categoria,
                precio: response[i].precio,
                valoracion: response[i].valoracion,
                cantidad: response[i].cantidad,
                imagen: response[i].imagen
                })
            }

            renderizarProductos(listaProductos);
            

            renderizarCategorias();
        } else if(xmlhttp.status == 404){
            alert("Ruta no encontrada");
        }
    }
}

xmlhttp.open("GET","http://localhost:3000/productos",true);
xmlhttp.send();

randerizarCarrito()

function randerizarCarrito(){
    $.ajax({
        url:'http://localhost:3000/carrito',
        type:'get',
        dataType:'json',
        success: function(e){
            const response = e;
            for (let i = 0; i < e.length; i++) {
                listaCarritos.push({
                    id: response[i].id,
                    nombre: response[i].nombre,
                    descripcion: response[i].descripcion,
                    precio: response[i].precio,
                    imagen: response[i].imagen
                });
            }
            
            BotonQuitar(listaCarritos);
    
        },
        error : function(r){
            console.log(r)
        }
    });
}






//console.log(listaCarritos[0])
//console.log(listaProductos[0])

