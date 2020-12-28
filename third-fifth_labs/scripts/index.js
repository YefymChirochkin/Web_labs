const url = "http://localhost:5010/attraction";

const attractionCatalog = document.getElementById("attraction-catalog");

const sortNameBtn = document.getElementById("sort-name-button");
const sortReverseNameBtn = document.getElementById("sort-reverse-name-button");

const getTotalPriceButton = document.getElementById("total-price-button");
const totalPriceOutput = document.getElementById("total-price-output");

const inputSearch = document.getElementById("find-attraction");
const findButton = document.getElementById("find-button");

const savingType = document.getElementById("saving-type");
const inputName = document.getElementById("input-name");
const inputMinAge = document.getElementById("input-min-age");
const inputPrice = document.getElementById("input-price");

const putEditedRecordButton = document.getElementById("put-edited-button");
const createRecordButton = document.getElementById("post-button");
const cancelEditButton = document.getElementById("cancel-edit-button");

// FETCH DATA
let attractions = [];
function fetchData(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (i = 0; i < data.length; i++) {
        attractions.push(data[i]);
      }
      showItems(attractions);
    });
}

let currentAttractions = attractions;

// SHOW ATTRACTIONS
const showItems = (itemsToShow) => {
  let htmlString = "";
  attractionCatalog.innerHTML = "";
  itemsToShow.forEach((item, index) => {
    htmlString += `
        <li class="attraction-item">
            <div class="attraction-info">            
                <h2>${item.name}</h2>
                <h3 class="min_age">${item.min_age}</h3>
                <h3 class="price_of_ticket_in_usd">${item.price_of_ticket_in_usd}</h3>
            </div>
            <div class= "operate-buttons">
                <button class="edit-button" id="edit-button" onclick="editRecord(${index})">Edit</button>
                <button class="delete-button" id="delete-button" onclick="deleteRecord(${index})">Delete</button>
            </div>
        </li>
        `;
  });
  attractionCatalog.innerHTML = htmlString;
};

// SORT
function compareByName(firstItem, secondItem) {
  var firstName = firstItem.name.toLowerCase();
  var secondName = secondItem.name.toLowerCase();
  if (firstName < secondName) {
    return -1;
  }
  if (firstName > secondName) {
    return 1;
  }
  return 0;
}

sortNameBtn.addEventListener("click", () => {
  currentAttractions.sort(compareByName);
  showItems(currentAttractions);
});

sortReverseNameBtn.addEventListener("click", () => {
  currentAttractions.sort(compareByName).reverse();
  showItems(currentAttractions);
});

// TOTAL PRICE
getTotalPriceButton.addEventListener("click", getTotalPrice);
function getTotalPrice() {
  var totalPrice = 0;
  currentAttractions.forEach(
    (item) => (totalPrice += parseFloat(item.price_of_ticket_in_usd))
  );
  totalPriceOutput.textContent = totalPrice + "$";
}

// SEARCH FILTER
findButton.addEventListener("click", filterItems);
let filterActive = false;
function filterItems() {
  const searchString = inputSearch.value.toLowerCase();
  if (searchString == "") {
    currentAttractions = attractions;
    showItems(attractions);
    filterActive = false;
  } else {
    filterActive = true;
  }
  const filteredItems = attractions.filter((attraction) => {
    return attraction.name.toLowerCase().includes(searchString);
  });
  currentAttractions = filteredItems;
  showItems(filteredItems);
}

// CRUD OPERATIONS:

// CREATE
createRecordButton.addEventListener("click", createRecord);
async function createRecord() {
  const inputNameValue = inputName.value;
  const inputMinAgeValue = inputMinAge.value;
  const inputPriceValue = inputPrice.value;
  if (
    validateFormRequirements(
      inputNameValue,
      inputMinAgeValue,
      inputPriceValue
    ) == false
  ) {
    return;
  }
  if (validateAgeAndPrice(inputMinAgeValue, inputPriceValue) == false) {
    return;
  }
  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      name: inputNameValue,
      min_age: inputMinAgeValue,
      price_of_ticket_in_usd: inputPriceValue,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (filterActive) {
        currentAttractions.push(data);
      }
      attractions.push(data);
      showItems(currentAttractions);
    });
}

// DELETE
async function deleteRecord(index) {
  fetch(url + "/" + currentAttractions[index].id, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      let deleteIndex = attractions.findIndex(
        (item) => item.id == currentAttractions[index].id
      );
      currentAttractions.splice(index, 1);
      attractions.splice(deleteIndex, 1);
      showItems(currentAttractions);
    });
}

// EDIT
let saveIndex;
async function editRecord(index) {
  createRecordButton.classList.add("hide");
  putEditedRecordButton.classList.remove("hide");
  cancelEditButton.classList.remove("hide");
  savingType.textContent = "Edit";
  inputName.value = currentAttractions[index].name;
  inputMinAge.value = currentAttractions[index].min_age;
  inputPrice.value = currentAttractions[index].price_of_ticket_in_usd;
  saveIndex = index;
}
putEditedRecordButton.addEventListener("click", async () => {
  const inputNameValue = inputName.value;
  const inputMinAgeValue = inputMinAge.value;
  const inputPriceValue = inputPrice.value;
  if (
    validateFormRequirements(
      inputNameValue,
      inputMinAgeValue,
      inputPriceValue
    ) == false
  ) {
    return;
  }
  if (validateAgeAndPrice(inputMinAgeValue, inputPriceValue) == false) {
    return;
  }
  currentAttractions[saveIndex].name = inputNameValue;
  currentAttractions[saveIndex].min_age = inputMinAgeValue;
  currentAttractions[saveIndex].price_of_ticket_in_usd = inputPriceValue;
  fetch(url + "/" + currentAttractions[saveIndex].id, {
    method: "PUT",
    body: JSON.stringify({
      name: inputNameValue,
      min_age: inputMinAgeValue,
      price_of_ticket_in_usd: inputPriceValue,
    }),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => showItems(currentAttractions));
  closeEdit();
});

cancelEditButton.addEventListener("click", closeEdit);
function closeEdit() {
  inputName.value = "";
  inputMinAge.value = "";
  inputPrice.value = "";
  createRecordButton.classList.remove("hide");
  putEditedRecordButton.classList.add("hide");
  cancelEditButton.classList.add("hide");
  savingType.textContent = "Create";
}
// VALIDATION
function validateFormRequirements(name, age, price) {
  if (name == "") {
    alert("Fill name field please");
    return false;
  }
  if (age == "") {
    alert("Fill age field please");
    return false;
  }
  if (price == 0) {
    alert("Fill price field please");
    return false;
  }
  return true;
}
function validateAgeAndPrice(age, price) {
  if (parseFloat(age) <= 0) {
    alert("Age cannot be <= 0");
    return false;
  }
  if (parseFloat(price) <= 0) {
    alert("Price cannot be <= 0");
    return false;
  }
  return true;
}

fetchData(url);
