const sortAplabetically = (array, key) => {
    return array?.sort((a, b) => {
        var textA = a[key].toUpperCase();
        var textB = b[key].toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
};

export { sortAplabetically }