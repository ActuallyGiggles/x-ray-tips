const examCardTemplate = document.querySelector("[data-exam-template]")
const examCardsContainer = document.querySelector("[data-exam-cards-container]")
const searchInput = document.querySelector("[exam-search]")

let examSeries = []

searchInput.addEventListener("input", function (event) {
    const value = event.target.value.toLowerCase()
    examSeries.forEach(exam => {
        const isVisible = exam.series.toLowerCase().includes(value)
        exam.element.classList.toggle("hide", !isVisible)
    });
})

document.addEventListener("click", function (event) {
    if (event.target.className == "main_card") {
        event.target.querySelector("[data-main-card-views]").classList.toggle("hide")
        for (const view of event.target.parentElement.querySelector("[data-views-cards]").children) {
            view.classList.toggle("hide")
        }
    } else if (event.target.className == "main_card_name" || event.target.className == "main_card_views") {
        event.target.parentElement.querySelector("[data-main-card-views]").classList.toggle("hide")
        for (const view of event.target.parentElement.parentElement.querySelector("[data-views-cards]").children) {
            view.classList.toggle("hide")
        }
    }
})

fetch("./exams.json")
    .then((res) => res.json())
    .then((data) => {
        examSeries = data.map(exam => {
            const exam_cards = examCardTemplate.content.cloneNode(true).children[0]

            const main_card = exam_cards.querySelector("[data-main-card]")
            main_card.id = exam["Series"]
            const series = main_card.querySelector("[data-main-card-name]")
            const views = main_card.querySelector("[data-main-card-views]")
            series.textContent = exam["Series"]
            views.textContent = exam["Views"]

            const views_cards = exam_cards.querySelector("[data-views-cards]")
            exam["Views"].split(", ").forEach(view => {
                const node = document.createElement("div")
                const textnode = document.createTextNode(view)
                node.appendChild(textnode)
                node.classList.add("hide")
                node.classList.add("view_card")
                views_cards.appendChild(node)
            });

            exam_cards.appendChild(main_card)
            exam_cards.appendChild(views_cards)

            examCardsContainer.append(exam_cards)
            return { series: exam["Series"], views: exam["Views"], element: exam_cards }
        });
    });
