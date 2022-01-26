let tagsNum = 0;
let cmCost = 0.02

document.addEventListener('DOMContentLoaded', function () {
    let elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
    elems.forEach(value => value.addEventListener('change', calculateResult))
});

//todo add calculation description

let t = `
<div class="row tag-pane" style="border-style: groove;">
    <div class="input-field col s2">
        <input id="{{tag_name}}" type="text" class="validate">
        <label for="{{tag_name}}">Tag name</label>
    </div>
    <div id="{{chips}}" class="chips chips-placeholder col s9"></div>
    <div class="input-field col s2">
        <input id="{{car_num}}" type="number" min="0" class="validate">
        <label for="{{car_num}}">Or type num here</label>
    </div>
</div`


let carNumIdPrefix = "car_num_";

function addTagInput() {
    let newElement = document.createElement("div")
    let t1 = t;
    t1 = t1.replaceAll("{{chips}}", "chips_" + tagsNum)
    t1 = t1.replaceAll("{{tag_name}}", "tag_name_" + tagsNum)
    let car_num_id = carNumIdPrefix + tagsNum;
    t1 = t1.replaceAll("{{car_num}}", car_num_id)
    tagsNum++;
    newElement.innerHTML = t1
    const button = document.getElementById("add-tag-button");
    document.body.insertBefore(newElement, button);

    const elems = newElement.querySelectorAll('.chips-placeholder');
    M.Chips.init(elems, {
        placeholder: 'Add tag value',
        onChipAdd: calculateResult,
        onChipDelete: calculateResult
    });

    let inputElem = document.getElementById(car_num_id);
    inputElem.oninput = function () {
        inputElem.innerHTML = "0"
        calculateResult()
    };
}


function calculateResult() {
    let chips = document.getElementsByClassName("chips");
    let tagsCar = [];
    for (let i = 0; i < chips.length; i++) {
        let carInput = document.getElementById(carNumIdPrefix + i);
        const instance = M.Chips.getInstance(chips[i]);
        if (carInput.value > 0) {
            tagsCar.push(carInput.value)
            deleteChips(instance)
            continue;
        }

        tagsCar.push(instance.chipsData.length)
    }

    let selectedMetric = document.getElementById('metric-type');
    let maxCardinality = tagsCar.reduce(function (previousValue, currentValue) {
        if (previousValue === 0 || currentValue === 0) {
            return Math.max(previousValue, currentValue)
        }
        return previousValue * currentValue
    });

    switch (selectedMetric.value) {
        case "HISTOGRAM":
            maxCardinality = maxCardinality * 5
            break;
        case "DISTRIBUTION":
            maxCardinality = maxCardinality * 5
            break;
        case "DISTRIBUTION_WITH_P":
            maxCardinality = maxCardinality * 10
            break;
    }
    document.getElementById("max-cardinality").innerHTML = "" + maxCardinality
    document.getElementById("result").innerHTML = "" + (maxCardinality * cmCost).toFixed(2)
}

function deleteChips(chipsInstance) {
    for (let i = 0; i < chipsInstance.chipsData.length; i++) {
        chipsInstance.deleteChip(i)
    }

}