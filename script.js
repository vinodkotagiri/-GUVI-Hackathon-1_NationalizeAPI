//Define Required UI Elements
let titleWrapper = document.createElement("div");
let title = document.createElement("h1");
let description = document.createElement("p");
let startBtn = document.createElement("button");
let linktoNext = document.createElement("a");
let mainSection = document.createElement("section");
let searchDescr = document.createElement("h3");
let searchDiv = document.createElement("div");
let searchField = document.createElement("input");
let searchBtn = document.createElement("button");
let nameSearched=document.createElement("h1");
let resultsContainer = document.createElement("div");
let outputRows = document.createElement("div");


//Set Attributes for the created Elements
titleWrapper.setAttribute("class", "title-wrapper container-fluid");
title.setAttribute("id", "title");
description.setAttribute("id", "description");
startBtn.setAttribute("id", "startBtn");
startBtn.setAttribute("class", "btn btn-primary");
linktoNext.setAttribute("href", "#mainSection");
mainSection.setAttribute("id", "mainSection");
mainSection.setAttribute("calss", "main-section");
searchDescr.setAttribute("id", "searchDescr");
searchField.setAttribute("class", "form-control");
searchField.setAttribute("id", "searchField");
searchBtn.setAttribute("id", "searchBtn");
searchBtn.setAttribute("class", "btn btn-lg btn-primary");
nameSearched.setAttribute("class","searched-name");
resultsContainer.setAttribute("class", "container results-div");

//Set Values for the elements
title.textContent = "Predict Nationality";
description.innerHTML = "Give us a name<br> We will predict which nation you may be from";
startBtn.innerText = "Lets Go!";
searchDescr.textContent = "Enter a name";
searchBtn.innerText = "Predict Nationality!";
nameSearched.textContent="";

titleWrapper.append(title);
titleWrapper.append(description);
titleWrapper.append(linktoNext);
linktoNext.append(startBtn);
mainSection.append(searchDescr);
mainSection.append(searchField);
mainSection.append(searchBtn);
mainSection.append(nameSearched);
document.body.append(titleWrapper);
document.body.append(mainSection);
outputRows.setAttribute("class", "row");
resultsContainer.append(outputRows);
mainSection.append(resultsContainer);

// Add Event Listeners to Retun Key and Search Button
let searchedName = "";
searchBtn.addEventListener("click", () => {
    searchedName = searchField.value;
    nameSearched.textContent=searchedName.charAt(0).toUpperCase()+searchedName.slice(1);
    console.log(searchedName);
    fetchNationalizeAPI(searchedName);
    if (searchedName == "") {
        alert("Name Required");
    }
});

searchField.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        searchedName = searchField.value;
        nameSearched.textContent=searchedName.charAt(0).toUpperCase()+searchedName.slice(1);
        console.log(searchedName);
        fetchNationalizeAPI(searchedName);
        if (searchedName == "") {
            alert("Name Required");
        }
    }
})



//Fetch API
function fetchNationalizeAPI(name) {
    async function getData() {
        const NationalizeAPI = `https://api.nationalize.io?name=${name}`;
        try {
            let response = await fetch(NationalizeAPI);
            //fetch local object to map ISO2 codes to Country names
            let iso2country = await fetch("./iso2-country.json");
            let data = await response.json();
            let iso2 = await iso2country.json();
            preprocessData(iso2, data);
        } catch (error) {
            console.log(error);
        } finally {
            console.log("fetched nationalize api succesfully!");
        }
    }
    getData();
}

//Initialize the Data
function preprocessData(iso, data) {
    let countryIso = iso;
    let nation = data.country;
    updateResult(nation, countryIso);
    console.log(nation);
}

//Update the Output
function updateResult(nation, countryIso) {
    let resultHTML = '';
    nation.map((entry) => {
        let probability = parseFloat(entry.probability).toFixed(2);
        resultHTML += `
        <div class="col-md-4 col-sm-12">
        <div class="card">
            <div class="img-div">
                <img src="https://countryflagsapi.com/svg/${entry.country_id}" alt="" class="country-img">
            </div>
            <div class="details-div">
                <h6 id="countryName">${countryIso[entry.country_id]}</h6>
                <p id="probability">probability- ${probability}</p>
            </div>
        </div>
    </div>`;
    })
    outputRows.innerHTML = resultHTML;
}
