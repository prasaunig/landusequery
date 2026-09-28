const csvUrl = "https://raw.githubusercontent.com/prasaunig/landusequery/refs/heads/main/script.js";
let csvData = [];

// Fetch CSV data on page load
document.addEventListener("DOMContentLoaded", async () => {
    showProgress(true);
    csvData = await fetchCSVData();
    populateVdcDropdown();
    showProgress(false);
});

// Show/Hide progress bar
function showProgress(show) {
    document.querySelector('.progress').style.display = show ? 'block' : 'none';
}

// Fetch and parse CSV data
async function fetchCSVData() {
    const response = await fetch(csvUrl);
    const text = await response.text();
    return text.split("\n").slice(1).map(row => {
        const [vdc, ward, parcel_id, landuse] = row.split(",");
        return { vdc, ward, parcel_id, landuse };
    });
}

// Populate VDC dropdown
function populateVdcDropdown() {
    const vdcDropdown = document.getElementById("vdc");
    const allOption = document.createElement("option");
    allOption.value = "ALL";
    allOption.textContent = "प्रसौनी गाउँपालिका (समग्र)";
    vdcDropdown.appendChild(allOption);
    const vdcOptions = [...new Set(csvData.map(item => item.vdc))].sort();
    vdcOptions.forEach(vdc => {
        const option = document.createElement("option");
        option.value = vdc;
        option.textContent = vdc;
        vdcDropdown.appendChild(option);
    });
}

// Populate Ward dropdown based on VDC selection
function populateWards() {
    const selectedVdc = document.getElementById("vdc").value;
     if (selectedVdc === "ALL") {
        displayResults(csvData);
        return;
    }
    const wardDropdown = document.getElementById("ward");
    wardDropdown.innerHTML = '<option value="">-- Select Ward --</option>';
    if (selectedVdc) {
        const wards = [...new Set(csvData.filter(item => item.vdc === selectedVdc).map(item => item.ward))].sort();
        wards.forEach(ward => {
            const option = document.createElement("option");
            option.value = ward;
            option.textContent = ward;
            wardDropdown.appendChild(option);
        });
    }
}

// Query the CSV data based on user inputs
function queryData() {
    const vdc = document.getElementById("vdc").value;
    const ward = document.getElementById("ward").value;
    const parcelId = document.getElementById("parcel").value.trim();
    let results = csvData;
  
    if (vdc && vdc !== "ALL")
    results = results.filter(item => item.vdc === vdc);
    if (vdc) results = results.filter(item => item.vdc === vdc);
    if (ward) results = results.filter(item => item.ward === ward);
    if (parcelId) results = results.filter(item => item.parcel_id === parcelId);

    displayResults(results);
}

// Display the filtered results
function displayResults(results) {
    const resultsDiv = document.getElementById("results");
    const selectedVdc = document.getElementById("vdc").value;
    resultsDiv.innerHTML = "";

    if (results.length === 0) {
        resultsDiv.innerHTML = "<p>No results found.</p>";
        return;
    }

    const table = document.createElement("table");
    table.className = "table table-bordered table-striped";

    const tbody = document.createElement("tbody");
 // If ALL selected → show FULL columns
    if (selectedVdc === "ALL") {

        table.innerHTML = `
            <thead>
                <tr>
                    <th>गा.वि.स</th>
                    <th>वार्ड नं.</th>
                    <th>कित्ता नं</th>
                    <th>भू-उपयोग क्षेत्र</th>
                </tr>
            </thead>
        `;
            results.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.vdc}</td>
                <td>${row.ward}</td>
                <td>${row.parcel_id}</td>
                <td>${row.landuse}</td>
            `;
            tbody.appendChild(tr);
        });

    }
  // Normal VDC → show only 2 columns
        else {

        table.innerHTML = `
            <thead>
                <tr>
                    <th>कित्ता नं</th>
                    <th>भू-उपयोग क्षेत्र</th>
                </tr>
            </thead>
        `;

        results.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.parcel_id}</td>
                <td>${row.landuse}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    table.appendChild(tbody);
    resultsDiv.appendChild(table);
}





