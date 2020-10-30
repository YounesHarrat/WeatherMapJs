
let lat = "33.441792"
let lon = "-94.037689"
const part = "hourly,minutely"
const appId = "c06516a3bb199bb320181c589f72433c"
const units = "metric"
const Input = document.querySelector('#searchBar>input')
const search = document.querySelector('#searchBar>button')


let cityName 

let url = 
"https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units="+units+"&exclude="+part+"&appid="+appId


const weekDC = document.querySelector('#weekDataContainer')

const data = [];

const displayChart = ()=>{
    Highcharts.chart('container', {
        chart: {
            type: 'line'
        },
        title: {
            text: 'Daily Average Temperature'
        },
        subtitle: {
            text: 'Source: WorldClimate.com'
        },
        xAxis: {
            categories: ['Mon', 'Tue', 'Wed', 'Thi', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: false
            }
        },
        series: [{
            name: cityName,
            data: data
        }]
    });
}

//function that will add data to the dayCardHeader of each card
const headerFill = (div , day)=>{
    let date = new Date(day.dt*1000)
    let weekDay = date.toLocaleString("fr-US",{weekday:"long",day:"numeric",month:"long"})
    div.innerHTML += "<p>"+weekDay.toUpperCase() +" "+day.temp.day+" °C <span></span>"+day.weather[0].main +"</p>"
}

const bodyFill = (div , day)=>{
    div.innerHTML += "<p>Min: "+day.temp.min+"°C <span></span>"
    +"Humidité: "+day.humidity+"%</p>"
    +"<p>Max: "+day.temp.max+"°C <span></span>"
    +"Pression: "+day.pressure+" hPa</p>"


//    div.innerHTML += <br> Pression:"+day.pressure+"hPa</p>"

}

const getAverageTempPerDay = (day) =>{
    let val = Math.floor((day.temp.min+day.temp.max)*100/2)/100
    data.push(val)
}

const makeWeekDOMCards = (dailyArray)=>{

    if(weekDC.children.length==0){
        console.log("new Commit")
    }
    else{
        console.log("UPDATED")
        weekDC.innerHTML ="";
    }
    
    dailyArray.forEach(day => {
        const dayCard = document.createElement('div')
        dayCard.classList = "cardDay col"
        
        const dayCardHeader = document.createElement('div')
        dayCardHeader.classList="headerDay row"
        
        headerFill(dayCardHeader, day)

        const dayCardBody = document.createElement('div')
        dayCardBody.classList="bodyDay row"

        bodyFill(dayCardBody, day)

        dayCard.appendChild(dayCardHeader)

        dayCard.appendChild(dayCardBody)

        weekDC.appendChild(dayCard)

        getAverageTempPerDay(day)


    });
    console.log(data)
    weekDC.removeChild(weekDC.lastChild)
    displayChart()
}

const init = (json) => {
    console.log(cityName)    
    if(json.daily){
        makeWeekDOMCards(json.daily)
    } else {
        alert("error no daily records")
    }
}

const getInfo = (lat,lon)=>{
    lat = lat
    lon = lon
    url = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units="+units+"&exclude="+part+"&appid="+appId
    
    fetch(url)
    .then( resp => resp.json(), err=> console.log(err))
    .then( json => {
        console.log(Input.value)
        console.log(json)
        init(json)
    })
}

const findCityPos = (city)=>{
    let cityName = city
    const url2 = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&appid="+appId

    fetch(url2)
    .then( resp => resp.json(), err=> console.log(err))
    .then( json => {
        lat = json.coord.lat
        lon = json.coord.lon
        getInfo(lat,lon)
    })
}

Input.addEventListener('input', ()=>{    cityName = Input.value })
search.addEventListener('click', ()=>{
    console.log(Input.value)
    findCityPos(Input.value)
})


//take the input and find the lat and lon
