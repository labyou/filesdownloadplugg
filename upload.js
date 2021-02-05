function bytesToSize(bytes) {
   const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (!bytes) return '0 Byte';
   const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}

const element = (tag, classes = [], content) => { 
    const node = document.createElement(tag);
    if (classes.length) { 
        node.classList.add(...classes);
    }
    if (content) { 
        node.textContent = content;
    }
    return node;
}

export function upload(selector, options = {}) {
    let files = [];
    const input = document.querySelector(selector); 

    const preview = element('div', ['preview']);
    const openButton = element('button', ['btn'], 'Open');
    const upload = element('button', ['btn', 'primary'], 'Download');
    upload.style.display = 'none';
    input.insertAdjacentElement('afterend', preview);
    input.insertAdjacentElement('afterend', upload)
    input.insertAdjacentElement('afterend', openButton);

    if (options.multi) { 
        input.setAttribute('multiple', true);
    }
    if (options.accept && Array.isArray(options.accept)) { 
        input.setAttribute('accept', options.accept.join(','));
    }
    const triggerInput = () => input.click();
    openButton.addEventListener('click', triggerInput);

    const changeHandler = event => { 
        if (!event.target.files.length) { return };

        files = Array.from(event.target.files);
        preview.innerHTML = '';
        upload.style.display = 'inline';
        files.forEach(file => {
            if (!file.type.match('image'))  return ;
            const reader = new FileReader();
            reader.onload = ev => {
                console.log(ev.target.result);
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview_block">
                        <div class="preview_remove" data-name="${file.name}">&times;</div>
                        <img src="${ev.target.result}" alt="${file.name}" />
                        <div class="preview_info">
                            <span>${file.name}</span>
                            ${bytesToSize(file.size)}
                        </div>
                    </div>
                `)
            }
            reader.readAsDataURL(file);
        })
    }
    const removeHandler = event => { 
        if (!event.target.dataset.name) return;
        const name = event.target.dataset.name;
        files = files.filter(file => file.name !== name);
        if (!files.length) { 
            upload.style.display = 'none';
        }
        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview_block');
        block.classList.add('removing');
        setTimeout(() => block.remove(), 300)
    }
    input.addEventListener('change', changeHandler);
    preview.addEventListener('click', removeHandler);
    upload.addEventListener('click', uploadHandler)
}