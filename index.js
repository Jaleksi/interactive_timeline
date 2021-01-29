const setHeader = () => {
    const header = document.getElementById("name_header");
    header.innerHTML = INFO.name;
}

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

const calculateTimeLineItemWidth = (item, min, max) => {
    const itemTo = new Date(item.to).getTime();
    const itemFrom = new Date(item.from).getTime();
    return (itemTo - itemFrom) / (max - min) * 100 + "%";
}

const calculateTimeLineItemLeft = (item, min, max) => {
    const itemTo = new Date(item.to).getTime();
    const itemFrom = new Date(item.from).getTime();
    return (itemFrom - min) / (max - min) * 100 + "%";
}

const createYearScale = (minDate, maxDate) => {
    const yearDiv = document.getElementById("year_scale");
    const timelineDiv = document.getElementById("timeline_container");

    const minYear = new Date(minDate).getFullYear();
    const maxYear = new Date(maxDate).getFullYear() + 1;
    const yearDivWidth = 100 / ((maxYear - minYear) * 2) + "%";

    for(let year=minYear; year<maxYear; year++){
        const yearElement = Object.assign(document.createElement("p"), {
            className: "yearElement"
        })
        yearElement.innerHTML = year;
        yearElement.style.width = yearDivWidth;
        yearDiv.appendChild(yearElement);

        const dividerElement = Object.assign(document.createElement("p"), {
            className: "yearElement"
        })
        dividerElement.innerHTML = "|";
        dividerElement.style.width = yearDivWidth;
        yearDiv.appendChild(dividerElement);
    }
}

const createLocationBar = (dataTitle, minDate, maxDate) => {
    const timelineContainer = document.getElementById("timeline_container");
    const locBar = Object.assign(document.createElement("div"), {
        id: dataTitle,
        className: "timeline_bar"
    });

    const icon = Object.assign(document.createElement("img"), {
        className: "icon",
        src: `./icons/${dataTitle}.svg`,
    });
    document.getElementById("icons").appendChild(icon);

    INFO.timelineData[dataTitle].forEach((item) => {
        const itemDiv = Object.assign(document.createElement("div"), {
            className: "timeline_item",
            onmouseover: () => {displayItemInfo(event)},
            onmouseleave: () => {closeItemInfo(event)},
            data: item
        });
        itemDiv.style.minWidth = calculateTimeLineItemWidth(item, minDate, maxDate);
        itemDiv.style.left = calculateTimeLineItemLeft(item, minDate, maxDate);
        itemDiv.style.backgroundColor = item.bg = getColor(item.place);
        locBar.appendChild(itemDiv);
    });


    timelineContainer.appendChild(locBar);
}

const displayItemInfo = (ev) => {
    const data = ev.target.data;
    const infoSection = document.getElementById("info_section");
    const infoSection2 = document.getElementById("second_info_section");

    infoSection.classList.add("hovered");
    infoSection2.classList.add("hovered");
    infoSection.style.backgroundColor = ev.target.data.bg;
    infoSection2.style.backgroundColor = ev.target.data.bg;
    infoSection.innerHTML = `${data.place}<br>${data.from}${data.to}`;
    infoSection2.innerHTML = data.description;
}

const closeItemInfo = (ev) => {
    const infoSection = document.getElementById("info_section");
    const infoSection2 = document.getElementById("second_info_section");
    infoSection.innerHTML = "";
    infoSection2.innerHTML = "";
    infoSection.classList.remove("hovered");
    infoSection2.classList.remove("hovered");

}

window.onload = () => {
    //setHeader();
    const [min, max] = dateScale(INFO.timelineData);
    createYearScale(min, max);
    ["locations", "education", "work"].forEach((subject) => {
        createLocationBar(subject, min, max);
    })

}
