const url = 'https://data.cityofnewyork.us/resource/k397-673e.json?$limit=10000&$offset=0';
const tableBody = document.getElementById('tableBody');
const highestByName = document.getElementById('highestByName');
const people_data = localStorage.getItem("OpenNYC_Data");
let people_data_object = null;


function dissolveAnim(color) {
    const dissolveDiv = document.createElement('div')
    dissolveDiv.className = 'dissolve'
    dissolveDiv.style.backgroundColor = color
    document.body.appendChild(dissolveDiv)
    const timeline = gsap.timeline();
    timeline.to(dissolveDiv, {
        opacity: 1,
        duration: 1,
        onComplete: () => {
            gsap.to(dissolveDiv, {
                opacity: 0,
                duration: 2,
                onComplete: () => {
                    document.body.removeChild(dissolveDiv)
                }
            });
        }
    });
}

// Parse and structure the localStorage data if it exists
if (people_data) {
    const parsedData = JSON.parse(people_data);
    // Accessing the data array within the stored object
    people_data_object = parsedData;
}

async function fetchData() {
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return data;
    }
    return [];
}
// Check for existing data in localStorage or fetch new data
if (!people_data_object || Date.now() > people_data_object.timestamp) {
    fetchData().then((data) => {
        localStorage.setItem("OpenNYC_Data", JSON.stringify({ data: data, timestamp: Date.now() + 60000 * 5 }));
        sortBySalary(data);
    });
} else {
    sortBySalary(people_data_object.data);
}

// Sort data by salary
function sortBySalary(data) {
    console.log(data);
    document.getElementById("tableBody").innerHTML = "";
    const sortedData = data.sort((a, b) => b.base_salary - a.base_salary);
    sortedData.forEach(item => {
        appendToTable(item);
    });
    return data;
}

// Append rows to table
function appendToTable(object) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${object.first_name || 'N/A'}</td>
        <td>${object.last_name || 'N/A'}</td>
        <td>${object.title_description || 'N/A'}</td>
        <td>${object.base_salary || 'N/A'}</td>
        <td>${object.agency_name || 'N/A'}</td>
    `;
    tableBody.appendChild(row);
}

// Filter and sort functions
function sortByLastName(letter) {
    const test = letter;
    const upper = test.toUpperCase()
    document.getElementById("tableBody").innerHTML = "";
    people_data_object.forEach(item => {
        if (item.last_name && item.last_name[0] === upper) {
            appendToTable(item);
        }
    });
}

function sortByFirstName(letter) {
    dissolveAnim('rgb(0, 0, 25)')
    const test = letter;
    const upper = test.toUpperCase()
    document.getElementById("tableBody").innerHTML = "";
    people_data_object.data.forEach(item => {
        if (item.first_name && item.first_name[0] === upper) {
            appendToTable(item);
        }
    });
}

function sortByAnnual() {
    document.getElementById("tableBody").innerHTML = "";
    people_data_object.data.forEach(item => {
        if (item.pay_basis === 'per Annum') {
            appendToTable(item);
        }
    });
}

function sortByHourly() {
    document.getElementById("tableBody").innerHTML = "";
    people_data_object.data.forEach(item => {
        if (item.pay_basis === 'per Hour') {
            appendToTable(item);
        }
    });
}

function FilterByBorough(boroughName) {
    let totalPeople = 0;
    let meanSalary = 0;
    let min = 0;
    let max = 1000000000;
    dissolveAnim('rgb(0, 0, 25)')
    people_data_object.data.forEach(person => {
        if (person.work_location_borough === boroughName) {
            if (person.pay_basis == 'per Annum') {
                let num = parseFloat(person.base_salary)
                meanSalary += num;
                if (num > min) {
                    min = num;
                }
                if (num < max) {
                    max = num;
                }
            }
            else {
                meanSalary += ((person.base_salary * 40) * 52);
            }
            totalPeople++;
        }
        if (boroughName == "ALL") {
            people_data_object.data.forEach(person => {
                if (person.pay_basis == 'per Annum') {
                    let num = parseFloat(person.base_salary)
                    meanSalary += num;
                    if (num > min) {
                        min = num;
                    }
                    if (num < max) {
                        max = num;
                    }
                }
                else {
                    meanSalary += ((person.base_salary * 40) * 52);
                }
                totalPeople++;
            })
        }
    })
    document.querySelector(".borough").innerHTML = "";
    document.querySelector(".min").innerHTML = "";
    document.querySelector(".max").innerHTML = "";
    document.querySelector(".mean").innerHTML = "";
    document.querySelector(".candidates").innerHTML = "";
    document.querySelector(".borough").innerHTML = "Filtered Borough: " + boroughName;
    document.querySelector(".min").innerHTML = "Lowest Paid: $" + min;
    document.querySelector(".max").innerHTML = "Highest Paid: $" + max;
    document.querySelector(".mean").innerHTML = "Mean Salary: $" + meanSalary / totalPeople;
    document.querySelector(".candidates").innerHTML = "People Averaged: $" + totalPeople;
    document.getElementById("tableBody").innerHTML = "";
    if (boroughName == "ALL") {
        people_data_object.data.forEach(person => {
            appendToTable(person);
        })
        return
    }
    people_data_object.data.forEach(person => {
        if (person.work_location_borough === boroughName) {
            appendToTable(person)
        }
    })
}

function MeanSalary(boroughName) {
    let totalPeople = 0;
    let meanSalary = 0;
    let min = 0;
    let max = 1000000000;
    people_data_object.data.forEach(person => {
        if (person.work_location_borough === boroughName) {
            if (person.pay_basis == 'per Annum') {
                let num = parseFloat(person.base_salary)
                meanSalary += num;
                if (num > min) {
                    min = num;
                }
                if (num < max) {
                    max = num;
                }
            }
            else {
                meanSalary += ((person.base_salary * 40) * 52);
            }
            totalPeople++;
        }
        if (boroughName == "ALL") {
            people_data_object.data.forEach(person => {
                if (person.pay_basis == 'per Annum') {
                    let num = parseFloat(person.base_salary)
                    meanSalary += num;
                    if (num > min) {
                        min = num;
                    }
                    if (num < max) {
                        max = num;
                    }
                }
                else {
                    meanSalary += ((person.base_salary * 40) * 52);
                }
                totalPeople++;
            })
        }
    })
}

// Event listeners for borough buttons
document.querySelector('.All').addEventListener("click", () => FilterByBorough('ALL'));
document.querySelector('.Brooklyn').addEventListener("click", () => FilterByBorough('BROOKLYN'));
document.querySelector('.Queens').addEventListener("click", () => FilterByBorough('QUEENS'));
document.querySelector('.Manhattan').addEventListener("click", () => FilterByBorough('MANHATTAN'));
document.querySelector('.Bronx').addEventListener("click", () => FilterByBorough('BRONX'));

let letterIQ = document.getElementById("letterIQ"); //Input field
let filter = document.getElementById("filter");//submit button
let letter = "";
filter.addEventListener('click', (event) => {
    event.preventDefault();
    letter = letterIQ.value.trim();
    sortByFirstName(letter);
})

document.getElementById('clear').addEventListener('click', (event) => {
    dissolveAnim('rgb(0, 0, 25)')
    event.preventDefault();
    if (letterIQ.value = '') {
        return;
    }
    letterIQ.value = '';
    sortBySalary(people_data_object.data)
})

function returnMean(letter) {
    let totalPeople = 0;
    let meanSalary = 0;
    let min = 0;
    let max = 1000000000;
    people_data_object.data.forEach(person => {
        if (person.first_name && person.first_name[0] === letter) {
            if (person.pay_basis == 'per Annum') {
                let num = parseFloat(person.base_salary)
                meanSalary += num;
                if (num > min) {
                    min = num;
                }
                if (num < max) {
                    max = num;
                }
            }
            else {
                meanSalary += ((person.base_salary * 40) * 52);
            }
            totalPeople++;
        }
    })
    return meanSalary / totalPeople;
}

let alphabet =
    [{
        "meanSalary": 0,
        "letter": "A"
    }, {
        "meanSalary": 0,
        "letter": "B"
    }, {
        'meanSalary': 0,
        'letter': "C"
    },
    {
        'meanSalary': 0,
        'letter': "D"
    },
    {
        'meanSalary': 0,
        'letter': "E"
    },
    {
        'meanSalary': 0,
        'letter': "F"
    },
    {
        'meanSalary': 0,
        'letter': "G"
    },
    {
        'meanSalary': 0,
        'letter': "H"
    },
    {
        'meanSalary': 0,
        'letter': "I"
    },
    {
        'meanSalary': 0,
        'letter': "J"
    },
    {
        'meanSalary': 0,
        'letter': "K"
    },
    {
        'meanSalary': 0,
        'letter': "L"
    },
    {
        'meanSalary': 0,
        'letter': "M"
    },
    {
        'meanSalary': 0,
        'letter': "N"
    },
    {
        'meanSalary': 0,
        'letter': "O"
    },
    {
        'meanSalary': 0,
        'letter': "P"
    },
    {
        'meanSalary': 0,
        'letter': "Q"
    },
    {
        'meanSalary': 0,
        'letter': "R"
    },
    {
        'meanSalary': 0,
        'letter': "S"
    },
    {
        'meanSalary': 0,
        'letter': "T"
    },
    {
        'meanSalary': 0,
        'letter': "U"
    },
    {
        'meanSalary': 0,
        'letter': "V"
    },
    {
        'meanSalary': 0,
        'letter': "W"
    },
    {
        'meanSalary': 0,
        'letter': "X"
    },
    {
        'meanSalary': 0,
        'letter': "Y"
    },
    {
        'meanSalary': 0,
        'letter': "Z"
    }
    ];

function sortByNameValue() {
    for (let i = 0; i < alphabet.length; i++) {
        alphabet[i].meanSalary = returnMean(alphabet[i].letter)
    }
    alphabet.sort((a, b) => b.meanSalary - a.meanSalary);
    for (let i = 0; i < alphabet.length; i++) {
        const person = document.createElement('p');
        person.innerHTML = `
            <p>${alphabet[i].letter + " " + alphabet[i].meanSalary}</p>`;
        highestByName.appendChild(person);
    }
}
// const url = 'https://data.cityofnewyork.us/resource/k397-673e.json?$limit=10000&$offset=0';
// const tableBody = document.getElementById('tableBody');
// const people_data = localStorage.getItem("OpenNYC_Data"); //localstorage
// let people_data_object = null;//localstorage object
// let tweaked_people_data = null;
// if (people_data) { //if this exists
//     people_data_object = JSON.parse(people_data) //then create the object value
//     tweaked_people_data = structuredClone(people_data_object);
// }

// async function fetchData() {
//     const response = await fetch(url)
//     if (response.ok) {
//         const data = await response.json();
//         sortBySalary(data);
//         return data
//     }
//     return [];
// }
// if (!people_data_object) { //if there is no local storage object created
//     fetchData()
//         .then((data) => {
//             localStorage.setItem("OpenNYC_Data", JSON.stringify(data)) //create the local storage object, and turn it into a JSON
//             //add expiry date 24hrs after this is loaded
//             sortBySalary(data); //sort the salary in descending order of highest to lowest.
//         })
// }
// else {
//     sortBySalary(people_data_object);
// }

// function sortBySalary() {
//     document.getElementById("tableBody").innerHTML = "";
//     const sortedData = people_data_object.sort((a, b) => b.base_salary - a.base_salary);
//     sortedData.forEach(item => {
//         appendToTable(item);
//     });
// }

// function appendToTable(object) {
//     const row = document.createElement('tr');
//     row.innerHTML = `
//     <td>${object.first_name || 'N/A'}</td>
//     <td>${object.title_description || 'N/A'}</td>
//     <td>${object.base_salary || 'N/A'}</td>
//     <td>${object.agency_name || 'N/A'}</td>
// `;
//     tableBody.appendChild(row);
// }
// //Function to sort by name
// //Just need to pass a value
// function sortByLastName() {
//     console.log(people_data_object);
//     document.getElementById("tableBody").innerHTML = "";
//     //.sort((a, b) => return a.salary - b.salary)
//     people_data_object.forEach(item => {
//         if (item.last_name[0] == 'A') {
//             appendToTable(item);
//         }
//     })
// }

// function sortByFirstName() {
//     document.getElementById("tableBody").innerHTML = "";
//     //.sort((a, b) => return a.salary - b.salary)
//     people_data_object.forEach(item => {
//         if (item.first_name[0] == 'A') {
//             appendToTable(item);
//         }
//     })
// }
// //sorts table by only showing People who are salaried
// function sortByAnnual() {
//     document.getElementById("tableBody").innerHTML = "";
//     document.getElementById("variable").innerHTML = "Annual Salary";
//     people_data_object.forEach(item => {
//         if (item.pay_basis == 'per Annum') {
//             appendToTable(item);
//         }
//     })
// }

// //sorts table by only showing people who work hourly
// function sortByHourly() {
//     document.getElementById("tableBody").innerHTML = "";
//     document.getElementById("variable").innerHTML = "Hourly Rate";
//     //.sort((a, b) => return a.salary - b.salary)
//     people_data_object.forEach(item => {
//         if (item.pay_basis == 'per Hour') {
//             appendToTable(item);
//         }
//     })
// }

// function FilterByBorough(boroughName) {
//     document.getElementById("tableBody").innerHTML = "";
//     console.log(boroughName);
//     let i = 0;
//     people_data_object.forEach(person => {
//         if (person.work_location_borough === boroughName && i < 10) {
//             appendToTable(person)
//             console.log(person);
//             i++
//         }
//         else if (i == 10) {
//             return;
//         }
//     })
// }

// let brooklyn = document.querySelector('.Brooklyn');
// let queens = document.querySelector('.Queens');
// let manhattan = document.querySelector('.Manhattan');
// let bronx = document.querySelector('.Bronx');
// let statenIsland = document.querySelector('.StatenIsland');
// let borough = "";
// // Loop through each button and add the event listener

// brooklyn.addEventListener("click", () => {
//     FilterByBorough('BROOKLYN');
// })

// queens.addEventListener("click", () => {
//     FilterByBorough('QUEENS');
// })

// manhattan.addEventListener("click", () => {
//     FilterByBorough('MANHATTAN');
// })

// bronx.addEventListener("click", () => {
//     FilterByBorough('BRONX');
// })

// statenIsland.addEventListener("click", () => {
//     FilterByBorough('STATEN ISLAND');
// })

// // let buttons = document.querySelectorAll('button')

// // buttons.forEach(button => {
// //     button.addEventListener("click", () => {
// //         document.getElementById("tableBody").innerHTML = "";
// //         if (button.getElementsByClassName(".Brooklyn")) {
// //             borough = "BROOKLYN";
// //         }
// //         else if (button.getElementsByClassName(".Queens")) {
// //             borough = "QUEENS";
// //         }
// //         else if (button.getElementsByClassName(".Manhattan")) {
// //             borough = "MANHATTAN";
// //         }
// //         else if (button.getElementsByClassName(".Bronx")) {
// //             borough = "BRONX";
// //         }
// //         else {
// //             borough = "STATEN ISLAND";
// //         }
// //         FilterByBorough(borough);
// //     });
// // });
