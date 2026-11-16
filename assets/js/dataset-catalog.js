(() => {
  const link = document.querySelector('[data-dataset-catalog]');
  const dialog = document.querySelector('#dataset-catalog');
  if (!link || !dialog || typeof dialog.showModal !== 'function' || !window.XLSX) return;

  const content = dialog.querySelector('.catalog-content');
  const status = dialog.querySelector('.catalog-status');
  let loading = false;
  let workbook;
  const catalogName = dialog.dataset.sheet;
  const english = catalogName === 'Dataset Catalog';
  const candidateName = english ? 'Representative Cases' : '대표 구현 후보';

  const controls = document.createElement('div');
  controls.style.cssText = 'display:flex; flex-wrap:wrap; gap:.5rem; padding:.45rem 1rem';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', english ? 'Dataset lists' : '데이터세트 목록 전환');
  status.before(controls);
  controls.style.display = 'none';
  const buttons = [];

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

  function renderSheet(name) {
    const sheet = workbook.Sheets[name];
    if (!sheet?.['!ref']) throw new Error('Worksheet missing');
    const range = XLSX.utils.decode_range(sheet['!ref']);
    if (range.e.r < 3) throw new Error('Column headings missing');
    range.s.r = 3;
    const [headers, ...rows] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: '',
      raw: false,
      blankrows: true,
      range: XLSX.utils.encode_range(range),
    });
    if (!headers?.some(Boolean)) throw new Error('Column headings missing');

    const table = document.createElement('table');
    addCells(table.createTHead().insertRow(), headers, 'th', sheet, range.s.c, 3);
    const body = table.createTBody();
    rows.forEach((values, index) => {
      if (values[2]?.trim()) {
        addCells(body.insertRow(), values, 'td', sheet, range.s.c, index + 4);
      }
    });
    if (!body.rows.length) {
      const cell = body.insertRow().insertCell();
      cell.colSpan = headers.length;
      cell.textContent = english ? 'No datasets to display.' : '표시할 데이터세트가 없습니다.';
    }

    content.replaceChildren(table);
    content.hidden = false;
    content.scrollTop = 0;
    content.scrollLeft = 0;
    const dateCell = sheet.A3 ?? workbook.Sheets[catalogName].A3;
    status.textContent = dateCell?.w || dateCell?.v || '';

    for (const [sheetName, button] of buttons) {
      const active = sheetName === name;
      button.setAttribute('aria-pressed', String(active));
      button.style.fontWeight = active ? 'bold' : 'normal';
      button.style.textDecoration = active ? 'underline' : 'none';
    }
  }

  for (const [name, label] of [
    [catalogName, english ? 'Dataset Catalog' : '데이터 목록'],
    [candidateName, candidateName],
  ]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => {
      try {
        renderSheet(name);
      } catch {
        status.textContent = dialog.dataset.error;
      }
    });
    controls.appendChild(button);
    buttons.push([name, button]);
  }

  link.addEventListener('click', async (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    dialog.showModal();
    if (loading || workbook) return;

    loading = true;
    status.textContent = dialog.dataset.loading;
    try {
      const response = await fetch(link.href);
      if (!response.ok) throw new Error('Workbook download failed');
      workbook = XLSX.read(await response.arrayBuffer());
      buttons[1][1].disabled = !workbook.Sheets[candidateName]?.['!ref'];
      renderSheet(catalogName);
      controls.style.display = 'flex';
    } catch {
      workbook = undefined;
      status.textContent = dialog.dataset.error;
    } finally {
      loading = false;
    }
  });
})();
