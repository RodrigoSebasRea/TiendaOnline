var listaCarritos = [];
var total = 0;

var cont = JSON.parse(localStorage.getItem("contador")) || "0";
$("#contador").text(cont);

function eliminar(id){
    if(cont>0){
        $.ajax({ url: `http://localhost:3000/carrito/${id}`, method: "DELETE" })
        .then(function (data) {

            cont--;
            localStorage.setItem("contador", JSON.stringify(cont));
            $("#contador").text(cont);

            location.reload();

            
        })
        .catch(function (err) {
            console.log(err);
        });
    }
}

function randerizarCarrito(){
    let htmlCarrito = '';
    let htmlCarrito1 = '';

    listaCarritos.forEach((valor)=>{

        htmlCarrito += `
        <div class="row">
                             <div class="col-12 col-sm-12 col-md-2 text-center">
                                     <img class="img-responsive" src="${valor.imagen}" alt="prewiew" width="120" height="80">
                             </div>
                             <div class="col-12 text-sm-center col-sm-12 text-md-left col-md-6">
                                 <h4 class="product-name"><strong>${valor.nombre}</strong></h4>
                                 <h4>
                                     <small>${valor.descripcion}</small>
                                 </h4>
                             </div>
                             <div class="col-12 col-sm-12 text-sm-center col-md-4 text-md-right row">
                                 <div class="col-3 col-sm-3 col-md-6 text-md-right" style="padding-top: 5px">
                                     <h6><strong>${valor.precio} <span class="text-muted">x</span></strong></h6>
                                 </div>
                                 <div class="col-4 col-sm-4 col-md-4">
                                     <div class="quantity">
                                         <input type="button" value="+" class="plus">
                                         <input type="number" step="1" max="99" min="1" value="1" title="Qty" class="qty"
                                                size="4">
                                         <input type="button" value="-" class="minus">
                                     </div>
                                 </div>
                                 <div class="col-2 col-sm-2 col-md-2 text-right">
                                     <button onclick="eliminar('${valor.id}')" type="button" class="btn btn-outline-danger btn-xs">
                                         <i class="fa fa-trash" aria-hidden="true"></i>
                                     </button>
                                 </div>
                             </div>
                         </div>
                         <hr>
        `
        total = total + parseFloat(valor.precio);
    })

    htmlCarrito1 = `<div class="pull-right">
                    <a href="" class="btn btn-outline-secondary pull-right">
                        Actualizar Carrito de Compras
                    </a>
                    </div>`
    $("#contenedorCarrito").append(htmlCarrito);
    $("#contenedorCarrito").append(htmlCarrito1);
    calcularTotal()
}

function calcularTotal(){
    let htmlTotal = `Precio Total: <b>S/.${total}</b>`
    $("#total").append(htmlTotal);
}

function randerizarCarritoX(){
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
            randerizarCarrito();
    
        },
        error : function(r){
            console.log(r)
        }
    });
}
randerizarCarritoX()