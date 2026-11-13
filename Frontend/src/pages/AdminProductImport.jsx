import { useState } from "react";
import { importProducts } from "../services/api";

function AdminProductImport() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(event) {
    const selectedFile = event.target.files[0];

    setFile(selectedFile);
    setResult(null);
    setError("");
  }

  async function handleUpload(event) {
    event.preventDefault();

    if (!file) {
      setError("Please select an Excel file.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await importProducts(file);

      console.log("Import API response:", data);

      const importedCount =
        data?.importedCount ??
        data?.ImportedCount ??
        data ??
        {};

      const normalizedResult = {
        message:
          data?.message ??
          data?.Message ??
          "Products imported successfully.",

        totalRows:
          importedCount?.totalRows ??
          importedCount?.TotalRows ??
          0,

        successfulRows:
          importedCount?.successfulRows ??
          importedCount?.SuccessfulRows ??
          0,

        failedRows:
          importedCount?.failedRows ??
          importedCount?.FailedRows ??
          0,

        errors:
          importedCount?.errors ??
          importedCount?.Errors ??
          []
      };

      console.log(
        "Normalized import result:",
        normalizedResult
      );

      setResult(normalizedResult);
    } catch (error) {
      console.error("Import error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function clearFile() {
    setFile(null);
    setResult(null);
    setError("");

    const input = document.getElementById("excelFile");

    if (input) {
      input.value = "";
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <span className="page-eyebrow">
            ADMINISTRATION
          </span>

          <h1>Bulk Product Import</h1>

          <p>
            Add multiple products to your store using
            an Excel spreadsheet.
          </p>
        </div>

        <div className="admin-page-stat">
          <strong>Excel</strong>
          <span>Import</span>
        </div>
      </div>

      {error && (
        <div className="admin-error">
          <strong>Import Error</strong>
          <p>{error}</p>
        </div>
      )}

      <div className="import-layout">
        {/* Upload section */}

        <section className="import-upload-card">
          <div className="admin-section-header">
            <div className="admin-section-icon">
              📊
            </div>

            <div>
              <h2>Upload Excel File</h2>

              <p>
                Select an .xlsx or .xls file containing
                your products.
              </p>
            </div>
          </div>

          <form onSubmit={handleUpload}>
            <label
              htmlFor="excelFile"
              className="import-drop-zone"
            >
              <span className="import-upload-icon">
                📁
              </span>

              <strong>
                {file
                  ? file.name
                  : "Choose an Excel file"}
              </strong>

              <span>
                {file
                  ? "File selected successfully"
                  : "Click here to browse your computer"}
              </span>

              <small>
                Supported formats: .xlsx, .xls
              </small>

              <input
                id="excelFile"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </label>

            {file && (
              <div className="selected-file">
                <div className="selected-file-icon">
                  📄
                </div>

                <div className="selected-file-details">
                  <strong>{file.name}</strong>

                  <span>
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>

                <button
                  type="button"
                  className="remove-file-button"
                  onClick={clearFile}
                >
                  Remove
                </button>
              </div>
            )}

            <button
              type="submit"
              className="import-upload-button"
              disabled={loading}
            >
              {loading
                ? "Uploading Products..."
                : "Upload Products"}
            </button>
          </form>
        </section>

        {/* Instructions */}

        <section className="import-info-card">
          <div className="admin-section-header">
            <div className="admin-section-icon">
              ℹ️
            </div>

            <div>
              <h2>Excel Format</h2>

              <p>
                Use the expected columns when creating
                your spreadsheet.
              </p>
            </div>
          </div>

          <div className="import-columns">
            <div className="import-column">
              <strong>Name</strong>
              <span>Product name</span>
            </div>

            <div className="import-column">
              <strong>Description</strong>
              <span>Product description</span>
            </div>

            <div className="import-column">
              <strong>Price</strong>
              <span>Product price</span>
            </div>

            <div className="import-column">
              <strong>CategoryId</strong>
              <span>Existing category ID</span>
            </div>

            <div className="import-column">
              <strong>Quantity</strong>
              <span>Initial stock quantity</span>
            </div>
          </div>

          <div className="import-note">
            <strong>Tip</strong>

            <p>
              Make sure the CategoryId values refer to
              existing categories before importing.
            </p>
          </div>
        </section>
      </div>

      {/* Import result */}

      {result && (
        <section className="import-result-card">
          <div className="import-result-header">
            <div>
              <span className="page-eyebrow">
                IMPORT COMPLETE
              </span>

              <h2>Import Result</h2>

              <p>{result.message}</p>
            </div>

            <div className="import-success-icon">
              ✓
            </div>
          </div>

          <div className="import-stat-grid">
            <div className="import-stat">
              <span>Total Rows</span>
              <strong>{result.totalRows}</strong>
            </div>

            <div className="import-stat import-stat-success">
              <span>Successful</span>
              <strong>
                {result.successfulRows}
              </strong>
            </div>

            <div className="import-stat import-stat-failed">
              <span>Failed</span>
              <strong>{result.failedRows}</strong>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="import-errors">
              <h3>Import Errors</h3>

              <p>
                Some rows could not be imported.
              </p>

              <ul>
                {result.errors.map(
                  (item, index) => (
                    <li key={index}>
                      {typeof item === "string"
                        ? item
                        : JSON.stringify(item)}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}

          {result.errors.length === 0 && (
            <div className="import-all-success">
              <span>✓</span>

              <p>
                All rows were imported successfully.
              </p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default AdminProductImport;