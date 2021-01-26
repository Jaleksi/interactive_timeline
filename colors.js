let registeredColors = {};

const getColor = (name) => {
    if(name in registeredColors){
        return registeredColors[name];
    }
    const newColor = randomColor();
    registeredColors[name] = newColor;
    return newColor;
}

const randomColor = () => {
    return "hsla(" + (Math.random() * 360) + ", 25%, 60%, 1)";
}
