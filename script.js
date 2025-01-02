const toolbox = document.getElementById('toolbox');
const formArea = document.getElementById('form-area');
const clearButton = document.getElementById('clear-button');

// ドラッグされた要素のデータを保存
toolbox.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('tool')) {
        e.dataTransfer.setData('type', e.target.dataset.type);
    }
});

// フォームエリアにドロップ可能にする
formArea.addEventListener('dragover', (e) => {
    e.preventDefault();
});

formArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('type');

    let newElement;
    switch (type) {
        case 'input':
            newElement = document.createElement('input');
            newElement.type = 'text';
            newElement.placeholder = '入力してください';
            break;
        case 'textarea':
            newElement = document.createElement('textarea');
            newElement.placeholder = 'テキストを入力してください';
            break;
        case 'button':
            newElement = document.createElement('button');
            newElement.textContent = '送信';
            break;
        case 'radio':
            newElement = document.createElement('div');
            newElement.classList.add('form-element');

            const addOptionButton = document.createElement('button');
            addOptionButton.textContent = '選択肢を追加';
            addOptionButton.style.display = 'block';
            addOptionButton.style.marginBottom = '10px';
            newElement.appendChild(addOptionButton);

            addOptionButton.addEventListener('click', () => {
                const newOption = document.createElement('div');
                newOption.style.display = 'flex';
                newOption.style.alignItems = 'center';
                newOption.style.marginBottom = '5px';

                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = `radio-${Date.now()}`;

                const labelInput = document.createElement('input');
                labelInput.type = 'text';
                labelInput.placeholder = '選択肢名';
                labelInput.style.marginLeft = '10px';

                newOption.appendChild(radioInput);
                newOption.appendChild(labelInput);
                newElement.appendChild(newOption);
            });
            break;
        default:
            return;
    }

    newElement.classList.add('form-element');
    newElement.draggable = true;

    newElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        e.dataTransfer.setData('text/html', newElement.outerHTML);
        newElement.classList.add('dragging');
    });

    newElement.addEventListener('dragend', (e) => {
        newElement.classList.remove('dragging');
    });

    formArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(formArea, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            formArea.appendChild(draggable);
        } else {
            formArea.insertBefore(draggable, afterElement);
        }
    });

    formArea.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        draggingElement.classList.remove('dragging');
    });

    formArea.appendChild(newElement);
});

// Get the element to place dragged item after
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.form-element:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// フォームエリアの要素を全て削除
clearButton.addEventListener('click', () => {
    const formElements = formArea.querySelectorAll('.form-element');
    formElements.forEach(element => element.remove());
});
