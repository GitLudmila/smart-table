import { cloneTemplate } from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const { tableTemplate, rowTemplate, before, after } = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    // Вставляем дополнительные шаблоны до таблицы
    before.reverse().forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.prepend(root[subName].container);
    });

    // И после таблицы
    after.forEach(subName => {
        root[subName] = cloneTemplate(subName);
        root.container.append(root[subName].container);
    });

    // @todo: #1.3 —  обработать события и вызвать onAction()
    // Обработчик события change
    root.container.addEventListener('change', () => {
        onAction(); // вызываем onAction без аргументов
    });

    // Обработчик события reset
    root.container.addEventListener('reset', () => {
        setTimeout(() => { onAction() }, 0)
    }); // Отложенный вызов onAction с задержкой

    // Обработчик события submit
    root.container.addEventListener('submit', (e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение формы
        onAction(e.submitter); // вызываем onAction с передачей e.submitter
    });

    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        const nextRows = data.map(item => {
            // Клонируем шаблон строки для каждого элемента данных
            const row = cloneTemplate(rowTemplate);

            // Перебираем ключи в объекте данных (item)
            Object.keys(item).forEach(key => {
                // Проверяем, существует ли элемент с таким ключом в клонированном шаблоне
                if (row.elements.hasOwnProperty(key)) {
                    // Если существует, присваиваем его textContent соответствующее значение из данных
                    row.elements[key].textContent = item[key];
                }
            });

            // Возвращаем контейнер строки (предполагается, что это DOM-элемент)
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    }

    return { ...root, render };
}