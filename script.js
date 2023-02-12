const examCardTemplate = document.querySelector("[data-exam-template]")
const examCardsContainer = document.querySelector("[data-exam-cards-container]")
const searchInput = document.querySelector("[exam-search]")

const page_name = document.getElementById("page_exam_name")
const page_img = document.getElementById("page_img")
const page_clinical_indications = document.getElementById("clinical_indications")
const page_technical_factors = document.getElementById("technical_factors")
const page_patient_position = document.getElementById("patient_position")
const page_part_position = document.getElementById("part_position")
const page_cr = document.getElementById("cr")
const page_respiration = document.getElementById("respiration")
const page_evaluation_criteria = document.getElementById("evaluation_criteria")

var isDarkTheme = true
var currentPart
var currentView

function populateListFromArray(list, array) {
    list.innerHTML = ""
    array.forEach(item => {
        var li = document.createElement("li")
        li.innerText = item
        list.appendChild(li)
    })
}

function populateListFromObject(list, object) {
    list.innerHTML = ""
    for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
            const item = object[key];
            var li = document.createElement("li")
            if (isDarkTheme) {
                li.innerHTML = `<span class="content_key">` + key + ":</span> " + item
            } else {
                li.innerHTML = `<span class="content_key_light_mode">` + key + ":</span> " + item
            }
            list.appendChild(li)
        }
    }
}

// Left side nav bar stuff
let exams = []

function getExams() {
    fetch("./exams/exams.json")
        .then((res) => res.json())
        .then((data) => {
            exams = data.map(series => {
                const exam_cards = examCardTemplate.content.cloneNode(true).children[0]

                const main_card = exam_cards.querySelector("[data-main-card]")
                main_card.id = series["Part"]
                const seriesElement = main_card.querySelector("[data-main-card-label]")
                seriesElement.textContent = series["Part"]

                const viewCardContainer = exam_cards.querySelector("[data-view-cards-container]")
                viewCardContainer.classList.add("hide")
                series["Views"].forEach(view => {
                    const viewCard = document.createElement("option")
                    viewCard.classList.add("view_card")
                    const textDiv = document.createElement("div")
                    textDiv.classList.add("view_card_label")
                    textDiv.dataset.part = series["Part"]
                    textDiv.dataset.view = view
                    const textnode = document.createTextNode(view)
                    textDiv.appendChild(textnode)
                    viewCard.appendChild(textDiv)
                    viewCard.dataset.part = series["Part"]
                    viewCard.dataset.view = view
                    viewCardContainer.appendChild(viewCard)
                });

                exam_cards.appendChild(viewCardContainer)
                exam_cards.appendChild(main_card)
                examCardsContainer.append(exam_cards)
                return { part: series["Part"], element: exam_cards }
            })
        })

    searchInput.addEventListener("input", function (event) {
        const value = event.target.value.toLowerCase()
        exams.forEach(exam => {
            const isVisible = exam.part.toLowerCase().includes(value)
            exam.element.classList.toggle("hide", !isVisible)
        })
    })
}

function generatePage() {
    document.addEventListener("click", function (event) {
        // Nav buttons
        if (event.target.id == "home") {
            document.getElementById("intro_content").innerHTML = "Search for an exam at the upper left.<br>Or...<br>Pick an exam to review."
            document.getElementById("column_one").classList.add("hide")
            document.getElementById("column_two").classList.add("hide")
        } else if (event.target.id == "about") {
            document.getElementById("intro_content").innerHTML = `Hi! My name is Mark!<br><br>I created this website as an x-ray student for x-ray students.<br>This is meant to be used if you quickly need to brush up on some exam you haven't done in a while.<br><br>Feel free to tell me what you think so far by emailing me at <span style="text-decoration: underline;">xray.positioning.tips@gmail.com</span>.<br><br>Have a radioactive day!`
            document.getElementById("column_one").classList.add("hide")
            document.getElementById("column_two").classList.add("hide")
        } else if (event.target.id == "theme") {
            // Change light/dark mode
            isDarkTheme = !isDarkTheme
            if (currentPart != null) {
                populatePageContent(currentPart, currentView)
            }

            // Change body
            document.body.classList.toggle("body_light_mode")
            // Change left bar
            document.getElementById("left_bar").classList.toggle("left_bar_light_mode")
            // Change page content
            document.getElementById("page_content").classList.toggle("page_content_light_mode")

            // Change Github logo and mode button text
            if (document.getElementById("gitImage").src.includes("light.png")) {
                document.getElementById("gitImage").src = "img/github_dark.png"
                document.getElementById("theme").innerText = "Dark Mode"
            } else if (document.getElementById("gitImage").src.includes("dark.png")) {
                document.getElementById("gitImage").src = "img/github_light.png"
                document.getElementById("theme").innerText = "Light Mode"
            }

            // Change drop down arrows
            var array = document.getElementsByClassName("drop_down_arrows")
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.src.includes("dark.png")) {
                    element.src = "img/dropdownarrowslight.png"
                } else if (element.src.includes("light.png")) {
                    element.src = "img/dropdownarrowsdark.png"
                }
            }
            // Change nav buttons
            var array = document.getElementsByClassName("nav_button")
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                element.classList.toggle("nav_button_light_mode")
            }
            // Change view cards container
            var array = document.getElementsByClassName("view_cards_container")
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                element.classList.toggle("view_cards_container_light_mode")
            }
            // Change view cards
            var array = document.getElementsByClassName("view_card")
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                element.classList.toggle("view_card_light_mode")
            }
            // Change main cards
            var array = document.getElementsByClassName("main_card")
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                element.classList.toggle("main_card_light_mode")
            }
            // Change content keys
            var array = document.getElementsByClassName("content_key")
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                element.classList.toggle("content_key_light_mode")
            }
        }

        // Get dropdown for each part
        for (let index = 0; index < event.target.className.split(" ").length; index++) {
            const className = event.target.className.split(" ")[index];

            var view_cards_container
            if (className == "main_card") {
                view_cards_container = event.target.parentElement.children[0]
            } else if (className == "main_card_label" || className == "drop_down_arrows") {
                view_cards_container = event.target.parentElement.parentElement.children[0]
            }

            // Hide all containers
            exams.forEach(exam => {
                exam.element.children[0].classList.add("hide")
                exam.element.children[1].children[1].className = 'drop_down_arrows fa-arrow-down';
            })
            // If a card is picked
            if (view_cards_container != null) {
                // Show the card's container
                view_cards_container.classList.toggle("hide")
                view_cards_container.parentElement.children[1].children[1].className = 'drop_down_arrows fa-arrow-down open';
            }

            for (let index = 0; index < event.target.className.split(" ").length; index++) {
                const className = event.target.className.split(" ")[index];
                if (className == "view_card" || className == "view_card_label") {
                    currentPart = event.target.dataset.part.toLowerCase()
                    currentView = event.target.dataset.view
                    populatePageContent(currentPart, currentView)
                }
            }
        }
    })
}

function populatePageContent(part, view) {
    document.getElementById("column_one").classList.add("hide")
    document.getElementById("column_two").classList.add("hide")

    fetch("./exams/" + part + "/" + part + ".json")
        .then((res) => res.json())
        .then((data) => {
            data.forEach(exam => {
                // View stays uppercase, as opposed to part
                if (exam["View"] == view) {
                    // Exam Name
                    page_name.innerHTML = exam["Name"]

                    // Exam Image
                    page_img.src = "./exams/" + part + "/" + exam["View"] + ".jpg"

                    // Clinical Indications
                    populateListFromArray(page_clinical_indications, exam["Clinical Indications"])

                    // Technical Factors
                    populateListFromObject(page_technical_factors, exam["Technical Factors"])

                    // Patient Position
                    populateListFromArray(page_patient_position, exam["Patient Position"])

                    // Part Position
                    populateListFromArray(page_part_position, exam["Part Position"])

                    // CR
                    populateListFromArray(page_cr, exam["CR"])

                    // Respiration
                    populateListFromArray(page_respiration, exam["Respiration"])

                    // Evaluation Criteria
                    populateListFromObject(page_evaluation_criteria, exam["Evaluation Criteria"])
                }
            })
        })

    document.getElementById("column_one").classList.remove("hide")
    document.getElementById("column_two").classList.remove("hide")
}

getExams()
generatePage()