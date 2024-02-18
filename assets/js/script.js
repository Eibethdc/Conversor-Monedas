const input = document.querySelector('input')
const select = document.querySelector('select')
const btn = document.querySelector('button')
let result = document.querySelector('#result')
const apiURL = 'https://mindicador.cl/api/'

async function getCurrency(apiURL){
    try{
        const res = await fetch(apiURL)
        const currency = await res.json()
        return currency
    }catch(e){
        const error = document.querySelector('#error')
        error.innerHTML = `¡Algo Salió mal! Error: ${e.message}`
    }
}

async function converter(){
    const data = await getCurrency(apiURL)
    const amount = input.value
    const selectedCurrency = select.value
    switch (selectedCurrency) {
        case'uf':
            total = amount / data.uf.valor
            break;
        case'dolar':
            total = amount / data.dolar.valor
            break;
        case'euro':
            total = amount / data.euro.valor
            break;
        case'utm':
            total = amount / data.utm.valor
            break;
        default:
            alert('Debes seleccionar una moneda para poder continuar')
            break;
    }
    if(selectedCurrency && amount > 0){
        result.innerHTML = `<b>CLP ${amount}</b> equivale a <b>${(total).toFixed(2)} ${selectedCurrency.toUpperCase()}</b`
    }else{
        result.innerHTML = 'Ingresa un valor válido para poder calcular el resultado'
    }
}

btn.addEventListener('click', async function() {
    const selectedCurrency = select.value
    const data = await getCurrency(`${apiURL}${selectedCurrency}`)

    converter()
    renderGraph(data)
})

async function graphConfiguration(data) {
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("es-ES", { year: 'numeric', month: '2-digit', day: '2-digit' })
    }
    const typeGraph = 'line'
    const dates = data.serie.map( item => formatDate(item.fecha))
    const tittleGraph = 'Historial últimos 10 días'
    const values = data.serie.map(item => item.valor)

    const conf = {
        type: typeGraph,
        data: {
            labels: dates.reverse().slice(-10),
            datasets: [
                {
                    label: tittleGraph,
                    borderColor: '#2D9596',
                    backgroundColor: '#2D9596',
                    data: values.reverse().slice(-10)
                }
            ]
        }
    }
    return conf
}

async function renderGraph(data) {
    const config = await graphConfiguration(data)
    const chartDOM = document.getElementById("myChart")
    const canvas = document.createElement("canvas")
    chartDOM.innerHTML = ''
    chartDOM.appendChild(canvas)
    chartDOM.style.backgroundColor = '#F1FADA'
    const ctx = canvas
    new Chart(ctx, config)
}




