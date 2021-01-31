const dateScale = (data) => {
    let minDate = Infinity;
    let maxDate = -Infinity;
    Object.keys(data).map((subject) => {
        data[subject].forEach((entry) => {
            const fromDate = new Date(entry.from);
            const toDate = new Date(entry.to);
            minDate = fromDate < minDate ? fromDate : minDate;
            maxDate = toDate > maxDate ? toDate : maxDate;
        });
    });
    return [minDate.getTime(), maxDate.getTime()];
}

const calculateTimeLineItemWidth = (item_from, item_to, min, max) => {
    let itemTo = new Date(item_to).getTime();
    let itemFrom = new Date(item_from).getTime();
    itemTo = itemTo < max ? itemTo : max;
    itemFrom = itemFrom > min ? itemFrom : min;
    return (itemTo - itemFrom) / (max - min) * 100 + "%";
}

const calculateTimeLineItemLeft = (item_from, min, max) => {
    let itemFrom = new Date(item_from).getTime();
    itemFrom = itemFrom > min ? itemFrom : min;
    return (itemFrom - min) / (max - min) * 100 + "%";
}

const createYearScale = (minDate, maxDate) => {
    const yearScaleDiv = document.getElementById("yearScale");
    const minYear = new Date(minDate).getFullYear();
    const maxYear = new Date(maxDate).getFullYear() + 1;

    for(let year=minYear; year<maxYear; year++){
        const yearElement = Object.assign(document.createElement("div"), {
            className: "yearScaleItem"
        })
        yearElement.style.left = calculateTimeLineItemLeft(`${year}-01-01`, minDate, maxDate);
        yearElement.style.width = calculateTimeLineItemWidth(`${year}-01-01`, `${year+1}-01-01`, minDate, maxDate);
        yearElement.innerHTML = year;
        yearScaleDiv.appendChild(yearElement);
    }
}

const createTimelineBar = (dataTitle, minDate, maxDate) => {
    const timelineBar = document.getElementById(dataTitle);

    INFO.timelineData[dataTitle].forEach((item) => {
        const itemDiv = Object.assign(document.createElement("div"), {
            className: "timelineItem",
            onmouseover: () => {
                const descText = `${item.place}<br>${item.from} / ${item.to}<br><br>${item.description}`;
                updateDesc(item.bg, descText);
            },
            onmouseleave: () => {
                updateDesc("black", "");
            },
            onclick : () => {
                const descText = `${item.place}<br>${item.from} / ${item.to}<br><br>${item.description}`;
                updateDesc(item.bg, descText);
            }
        });
        itemDiv.style.minWidth = calculateTimeLineItemWidth(item.from, item.to, minDate, maxDate);
        itemDiv.style.left = calculateTimeLineItemLeft(item.from, minDate, maxDate);
        itemDiv.style.backgroundColor = item.bg = getColor(item.place);
        timelineBar.appendChild(itemDiv);
    });

}

const updateDesc = (color, text) => {
    const desc = document.getElementById("desc");
    desc.style.backgroundColor = color;
    desc.innerHTML = text;
}

window.onload = () => {
    const [min, max] = dateScale(INFO.timelineData);
    createYearScale(min, max);
    ["locations", "education", "work"].forEach((subject) => {
        createTimelineBar(subject, min, max);
    })

}
