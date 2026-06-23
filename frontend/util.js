function getCarImagePath(car) {
    const name = (car.name + car.model).toLowerCase().replace(/\s/g, "");
    return `img/cars/${name}.jpg`;
}