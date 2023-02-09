const examCardTemplate = document.querySelector("[data-exam-template]")
const examCardsContainer = document.querySelector("[data-exam-cards-container]")
const searchInput = document.querySelector("[exam-search]")

let examSeries = []

const onReady = (callback) => {
    if (document.readyState != "loading") {
        callback();
    }
    else if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", callback);
    }
    else {
        document.attachEvent("onreadystatechange", function () {
            if (document.readyState == "complete") {
                callback();
            }
        });
    }
};

onReady(async () => {
    searchInput.addEventListener("input", function (event) {
        const value = event.target.value.toLowerCase()
        examSeries.forEach(exam => {
            const isVisible = exam.series.toLowerCase().includes(value)
            exam.element.classList.toggle("hide", !isVisible)
        });
    })

    document.addEventListener("click", function (event) {
        if (event.target.className == "series_card") {
            var seriesName = event.target.id
            console.log(seriesName)
        } else if (event.target.className == "series_name" || event.target.className == "series_views") {
            var seriesName = event.target.parentElement.id
            console.log(seriesName)
        }
    })
});

fetch("./exams.json")
    .then((res) => res.json())
    .then((data) => {
        examSeries = data.map(exam => {
            const card = examCardTemplate.content.cloneNode(true).children[0]
            card.id = exam["Series"]

            const series = card.querySelector("[data-series]")
            const views = card.querySelector("[data-views]")

            series.textContent = exam["Series"]
            views.textContent = exam["Views"]

            examCardsContainer.append(card)
            return { series: exam["Series"], views: exam["Views"], element: card }
        });
    });
