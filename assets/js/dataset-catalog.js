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
      const workbook = XLSX.read(await response.arrayBuffer());
      const sheet = workbook.Sheets[dialog.dataset.sheet];
      if (!sheet || !sheet['!ref']) throw new Error('Catalog worksheet missing');
      const range = XLSX.utils.decode_range(sheet['!ref']);
      const startColumn = range.s.c;
      range.s.r = 3;
      const [headers, ...rows] = XLSX.utils.sheet_to_json(sheet, {
        header: 1, defval: '', raw: false, range: XLSX.utils.encode_range(range),
      });
      if (!headers?.some(Boolean)) throw new Error('Column headings missing');

      const table = document.createElement('table');
      addCells(table.createTHead().insertRow(), headers, 'th', sheet, startColumn, 3);
      const body = table.createTBody();
      rows.forEach((values, index) => {
        if (values.some(Boolean)) addCells(body.insertRow(), values, 'td', sheet, startColumn, index + 4);
      });
      content.replaceChildren(table);
      content.hidden = false;
      status.textContent = sheet.A3?.w || sheet.A3?.v || '';
      loaded = true;
    } catch {
      status.textContent = dialog.dataset.error;
    } finally {
      loading = false;
    }
  });
})();
