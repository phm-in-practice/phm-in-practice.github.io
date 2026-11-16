(() => {
  const link = document.querySelector('[data-dataset-catalog]');
  const dialog = document.querySelector('#dataset-catalog');
  if (!link || !dialog || typeof dialog.showModal !== 'function' || !window.XLSX) return;

  const content = dialog.querySelector('.catalog-content');
  const status = dialog.querySelector('.catalog-status');
  let loading = false;
  let loaded = false;

  function addCells(row, values, tag, source, startColumn, sourceRow) {
    values.forEach((value, column) => {
      const cell = row.appendChild(document.createElement(tag));
      if (tag === 'th') cell.scope = 'col';
      const address = XLSX.utils.encode_cell({ c: startColumn + column, r: sourceRow });
      const sourceCell = source[address];
      const formulaLink = sourceCell?.f?.match(/^HYPERLINK\(\s*"([^"]+)"/i);
      const target = sourceCell?.l?.Target || formulaLink?.[1];
      if (/^https?:\/\//i.test(target || '')) {
        const anchor = cell.appendChild(document.createElement('a'));
        anchor.href = target;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        anchor.textContent = value || target;
      } else {
        cell.textContent = value;
      }
    });
  }

    const catalogName = dialog.dataset.sheet;
  const isEnglish = catalogName === 'Dataset Catalog';
  const candidateName = isEnglish ? 'Representative Cases' : '대표 구현 후보';
  let workbook;

  const controls = document.createElement('div');
  controls.style.padding = '0.45rem 1rem';
  controls.hidden = true;
  status.before(controls);

  const buttons = new Map();
  for (const [name, label] of [
    [catalogName, isEnglish ? 'Dataset Catalog' : '데이터 목록'],
    [candidateName, candidateName],
  ]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.style.marginRight = '0.5rem';
    button.addEventListener('click', () => renderSheet(name));
    controls.appendChild(button);
    buttons.set(name, button);
  }

  function renderSheet(name) {
    const sheet = workbook.Sheets[name];
    const range = XLSX.utils.decode_range(sheet['!ref']);
    range.s.r = 3;
    const [headers, ...rows] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
      raw: false,
      range: XLSX.utils.encode_range(range),
    });

    const table = document.createElement('table');
    addCells(table.createTHead().insertRow(), headers, 'th', sheet, range.s.c, 3);
    const body = table.createTBody();
    rows.forEach((values, index) => {
      if (values[2]) {
        addCells(body.insertRow(), values, 'td', sheet, range.s.c, index + 4);
      }
    });

    content.replaceChildren(table);
    content.hidden = false;
    content.scrollTop = 0;
    content.scrollLeft = 0;

    for (const [sheetName, button] of buttons) {
      const selected = sheetName === name;
      button.setAttribute('aria-pressed', String(selected));
      button.style.fontWeight = selected ? 'bold' : 'normal';
      button.style.textDecoration = selected ? 'underline' : 'none';
    }
  }

  link.addEventListener('click', async (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.showModal();
    if (loading || loaded) return;

    loading = true;
    status.textContent = dialog.dataset.loading;
    try {
      const response = await fetch(link.href);
      if (!response.ok) throw new Error('Workbook download failed');
      workbook = XLSX.read(await response.arrayBuffer());

      const catalog = workbook.Sheets[catalogName];
      if (!catalog?.['!ref']) throw new Error('Catalog worksheet missing');

      buttons.get(candidateName).disabled = !workbook.Sheets[candidateName]?.['!ref'];
      renderSheet(catalogName);
      controls.hidden = false;
      status.textContent = catalog.A3?.w || catalog.A3?.v || '';
      loaded = true;
    } catch {
      status.textContent = dialog.dataset.error;
    } finally {
      loading = false;
    }
  });
})();
