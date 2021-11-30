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

const main = () => {
    var selectEstado = document.getElementById("selectEstado")
    selectEstado.addEventListener("click",() => {disableSelect(selectEstado.value)})
}

window.addEventListener("load",main)