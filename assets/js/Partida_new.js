const disableSelect = (selectEstado) => {
    var selectResultado = document.getElementById("selectResultado")
    

    if(selectEstado == "Pendiente" || selectEstado == "Iniciado"){
        selectResultado.value = "pendiente"
        selectResultado.disabled = true
    }else{
        selectResultado.value = -1
        selectResultado.disabled = false
    }
}

const disableNoObstrusivo = (evt) => {
    const select = evt.target;
    const value = select.value;

    disableSelect(value)
}

const main = () => {
    var selectEstado = document.getElementById("selectEstado")
    selectEstado.addEventListener("click",(disableNoObstrusivo))
}

window.addEventListener("load",main)