---
lang: en
ref: examples
permalink: /en/examples/
title: PHM Examples
subtitle: PHM implementation examples
---
<!-- To add an example: upload its HTML file to the cases folder, then add a line "## [Example title](/cases/file-name.html)" and a description paragraph at the bottom. -->

This section presents PHM implementation examples not covered in the textbook.

Research institutions and companies around the world make datasets collected from equipment and components across a range of industries publicly available for PHM and related research. These datasets can be found in various public data repositories. The <a href="/assets/data/PHM_Industrial_Open_Datasets-en.xlsx" data-dataset-catalog>Public Dataset List</a> identifies the industry, equipment or component, and source for each dataset. The examples on this site use selected datasets suited to specific PHM tasks, such as anomaly detection, fault diagnosis, and remaining useful life prediction.

The practice notebooks and datasets are available at the same address provided in the textbook: [tinyurl.com/phm-practice](https://tinyurl.com/phm-practice).

<div>
<link rel="stylesheet" href="/assets/css/dataset-catalog.css">
<dialog id="dataset-catalog" aria-labelledby="dataset-catalog-title" data-sheet="Dataset Catalog" data-loading="Loading the dataset list…" data-error="The list could not be loaded. Download the Excel file to view it.">
  <header class="catalog-header">
    <h2 id="dataset-catalog-title">Public Dataset List</h2>
    <div class="catalog-actions">
      <a href="/assets/data/PHM_Industrial_Open_Datasets-en.xlsx" download>Download Excel</a>
      <form method="dialog"><button autofocus>Close</button></form>
    </div>
  </header>
  <p class="catalog-status" role="status"></p>
  <div class="catalog-content" tabindex="0" role="region" aria-labelledby="dataset-catalog-title" hidden></div>
</dialog>
<script defer src="/assets/js/xlsx-0.20.3.min.js"></script>
<script defer src="/assets/js/dataset-catalog.js"></script>
</div>

## [Anomaly Detection and Health Diagnosis of a Turbine Generator Lubrication System](/cases/A01_TGLS_en.html)

Pressure, temperature, flow rate, and vibration data from a turbine generator lubrication system are used to detect anomalies and diagnose component faults and their severity. The example compares results across sensor feature sets and diagnostic methods, and examines how component faults affect the operating condition of the bearing.
