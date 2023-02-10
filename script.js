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
            li.innerText = key + ": " + item
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
                const seriesElement = main_card.querySelector("[data-main-card-name]")
                seriesElement.textContent = series["Part"]

                const viewsElement = main_card.querySelector("[data-main-card-views]")
                series["Views"].forEach(view => {
                    const node = document.createElement("div")
                    const textnode = document.createTextNode(view)
                    node.appendChild(textnode)
                    node.classList.add("view_card")
                    node.dataset.part = series["Part"]
                    node.dataset.view = view
                    viewsElement.appendChild(node)
                });

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
        });
    })
}



function generatePage() {
    document.addEventListener("click", function (event) {
        if (event.target.className == "view_card") {
            var part = event.target.dataset.part.toLowerCase()
            var view = event.target.dataset.view

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
            document.getElementById("intro").classList.add("hide")
        }
    })
}

getExams()
generatePage()