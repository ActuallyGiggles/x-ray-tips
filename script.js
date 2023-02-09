const examCardTemplate = document.querySelector("[data-exam-template]")
const examCardsContainer = document.querySelector("[data-exam-cards-container]")

fetch('./exams.json')
    .then((res) => res.json())
    .then((data) => {
        data.forEach(exam => {
            const card = examCardTemplate.content.cloneNode(true).children[0]
            const series = card.querySelector("[data-series]")
            const views = card.querySelector("[data-views]")
            series.textContent = exam["Series"]
            views.textContent = exam["Views"]
            examCardsContainer.append(card)
        });
    });