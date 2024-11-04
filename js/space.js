const inputBuscar = document.getElementById('inputBuscar');
const btnBuscar = document.getElementById('btnBuscar');
const contenedor = document.getElementById('contenedor');

btnBuscar.addEventListener('click', () => {
    const query = inputBuscar.value.trim(); // obtenemos el valor del input; trim elimina espacios antes y después del texto
    if (query) {
        buscarImagenes(query); // si se ingresó un texto, se ejecuta la función para buscar imágenes
    }
});

function buscarImagenes(query) {
    fetch(`https://images-api.nasa.gov/search?q=${query}`)
    .then(response => {
        return response.json(); // convertir a json la respuesta
    })
    .then(data => {
        contenedor.innerHTML = ''; // limpia el contenedor para que no se acumulen los resultados
        const items = data.collection.items; 
        // comprobar si exiten resultados
        if (items.length === 0) {
            contenedor.innerHTML = '<p>No se encontraron resultados.</p>'
        }

        items.forEach(item => {
            const { title, description, date_created } = item.data[0]; // desestructuración, se obtienen las propiedades title, description y date_created del objeto que se ubica en item.data[0]
            const imgUrl = item.links ? item.links[0].href : ''; // si existe un url de imagen se asigna a la variable, si no, se asigna un espacio vacío, esto es para que no ocurra un error si el item no tiene un link

            // creación de la card con bootstrap
            const card = ` 
              <div class="col-lg-4 col-md-6 mb-3"> 
                <div class="card" style="width: 100%;">
                  <img src="${imgUrl}" class="card-img-top" alt="${title}">
                  <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <p class="card-text">${description || 'Descripción no disponible'}</p>
                    <p class="card-text"><small class="text-muted">Fecha: ${new Date(date_created).toLocaleDateString()}</small></p> 
                  </div>
                </div>
              </div>
            `;
        // la fecha se muestra en otro formato, se utiliza ${new Date(date_created).toLocaleDateString()} para que sea legible

            contenedor.innerHTML += card; // se agrega la card al contenedor
        });
    })

    // manejo de errores
    .catch(error => {
        console.error('Error al obtener imágenes:', error);
        contenedor.innerHTML = '<p>Ocurrió un error. Inténtalo de nuevo más tarde.</p>';
    });
}
