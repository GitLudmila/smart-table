export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (button.name === 'clear') {
            // Находим input рядом с кнопкой. Получаем родительский элемент (предполагается, что input и button находятся в одном div/элементе)
            const parentElement = button.parentElement;
            const inputElement = parentElement.querySelector('input'); // или другой селектор, если структура другая

            if (inputElement) {
                // Сбрасываем value input
                inputElement.value = '';

                // Получаем значение атрибута data-field кнопки, чтобы понять, какое поле в state нужно сбросить
                const fieldName = button.dataset.field;

                if (fieldName) {
                    // Сбрасываем соответствующее поле в state
                    state[fieldName] = '';
                }
            }
        }
        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}