const listaProductos = [];
const listaCarritos = [];
const productoscarritoId = [];

var listaOrden;

var cont = JSON.parse(localStorage.getItem("contador")) || "0";
$("#contador").text(cont);


$("#CerrarCategorias").on('click',function(){
    renderizarProductos(listaProductos);
    randerizarCarrito()
    listaOrden = listaProductos;
    $("#Cabecera").text("Nuestros Productos");
    $("#CerrarCategorias").hide();

})

$( "input" ).on( "click", function() {
    let valor = $( "input:checked" ).val()
    Ordenar(valor,listaOrden);
});

function filterItems(texto,lista) {
    return lista.filter(function(productos) {
        return productos.nombre.toLowerCase().indexOf(texto.toLowerCase()) > -1;
    })
  }


function buscando(){
    var texto = $("#cajabuscar").val();
    var listaBusqueda = filterItems(texto,listaOrden);
    renderizarProductos(listaBusqueda);
}


function enviar(idproducto){

    if (productoscarritoId.includes(idproducto)) {
        alert("Ya esta registrado este id")
    }else{
        var {id,nombre,descripcion,precio,imagen} = listaProductos.find( valor =>valor.id == idproducto) ;
        var data = {id,nombre,descripcion,precio,imagen};

        $.ajax({
                url : 'http://localhost:3000/carrito',
                data : data, 
                method : 'post',
                dataType : 'json',
                success : function(response){
                    alert("Registrado")

                    $( `#nose${response.id}` ).prop( "disabled", false ); 

                    productoscarritoId.push(idproducto);

                    cont++;
                    localStorage.setItem("contador", JSON.stringify(cont));
                    $("#contador").text(cont);
                },
                error: function(error){
                    console.log(error);
                }
        });
    }
}

function Quitar(id){
    if(cont>0){
        $.ajax({ url: `http://localhost:3000/carrito/${id}`, method: "DELETE" })
        .then(function (data) {

            $( `#nose${id}` ).prop( "disabled", true ); 
            
            var index = productoscarritoId.indexOf(id);
            if (index > -1) {
                productoscarritoId.splice(index, 1);
            }
            
            cont--;
            localStorage.setItem("contador", JSON.stringify(cont));
            $("#contador").text(cont);
        })
        .catch(function (err) {
            console.log(err);
        });
    }
}

function HabilitarQuitar(lista){
    for (let index = 0; index < lista.length; index++) {
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
                          

                          <button style="margin-right:5px;" id="registrar" onclick="enviar('${producto.id}')" class="btn btn-outline-primary col-md-4">Registrar</button>
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
    randerizarCarrito()
    
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
    })
}

function Ordenar(valor,lista){
    switch(valor){
        case 'precio' : 
        listaPrecio =  lista.sort(function(a,b){
            return a.precio - b.precio;
        });

        renderizarProductos(listaPrecio);
        break;

        case 'titulo' : 
        listaTitulo =  lista.sort(function(a,b){
            return a.nombre.toLowerCase().localeCompare(b.nombre.toLowerCase());
        });

        renderizarProductos(listaTitulo);
        break;

        case 'relevancia' : 
        listaRelevancia =  lista.sort(function(a,b){
            return b.valoracion - a.valoracion;
        });

        renderizarProductos(listaRelevancia);
        break;

        case 'vendidos' : 
        listaVendidos =  lista.sort(function(a,b){
            return b.cantidad - a.cantidad;
        });

        renderizarProductos(listaVendidos);
        break;
    }    
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
    listaOrden = productosCategoria;
    renderizarProductos(productosCategoria);
    $("#Cabecera").text(productosCategoria[0].categoria);
    $("#CerrarCategorias").show();
}


function randerizarProductoX(){
    $.ajax({
        url:'http://localhost:3000/productos',
        type:'get',
        dataType:'json',
        success: function(e){
            const response = e;
            for (let i = 0; i < e.length; i++) {
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
            listaOrden = listaProductos;
    
        },
        error : function(r){
            console.log(r)
        }
    });
}
randerizarProductoX()



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
            HabilitarQuitar(listaCarritos);
    
        },
        error : function(r){
            console.log(r)
        }
    });
}
randerizarCarrito()









