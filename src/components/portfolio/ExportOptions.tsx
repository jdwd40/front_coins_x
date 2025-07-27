import React, { useState } from 'react';
import { Transaction } from '@/types/trading.types';
import { exportTransactions } from '@/utils/analytics';

interface ExportOptionsProps {
  transactions: Transaction[];
  onExport?: (data: string | Blob, filename: string) => void;
}

export const ExportOptions: React.FC<ExportOptionsProps> = ({
  transactions,
  onExport,
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [filename, setFilename] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleExport = async () => {
    if (transactions.length === 0) {
      setExportError('No transactions to export');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      const exportData = exportTransactions(transactions, exportFormat);
      const defaultFilename = `transactions-${new Date().toISOString().split('T')[0]}`;
      const finalFilename = filename || defaultFilename;
      const fileExtension = exportFormat === 'json' ? '.json' : '.csv';
      const fullFilename = finalFilename + fileExtension;

      // If onExport callback is provided, use it
      if (onExport) {
        onExport(exportData, fullFilename);
      } else {
        // Default browser download behavior
        const blob = new Blob([exportData as string], {
          type: exportFormat === 'json' ? 'application/json' : 'text/csv',
        });
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fullFilename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      // Reset form
      setFilename('');
    } catch (error) {
      setExportError(error instanceof Error ? error.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const getExportPreview = () => {
    if (transactions.length === 0) return 'No transactions available for export';

    const sampleTransaction = transactions[0];
    if (exportFormat === 'json') {
      return JSON.stringify(sampleTransaction, null, 2);
    } else {
      return `Transaction ID,Type,Coin Name,Coin Symbol,Quantity,Price,Total Amount,Fee,Status,Date\n${sampleTransaction.transaction_id},${sampleTransaction.type},${sampleTransaction.coin_name},${sampleTransaction.symbol},${Number(sampleTransaction.quantity).toFixed(6)},${Number(sampleTransaction.price).toFixed(2)},${Number(sampleTransaction.total_amount).toFixed(2)},0,${sampleTransaction.status || ''},${new Date(sampleTransaction.created_at).toISOString()}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Export Transaction Data
        </h2>

        <div className="space-y-6">
          {/* Export Format Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="exportFormat"
                  value="json"
                  checked={exportFormat === 'json'}
                  onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">JSON</div>
                  <div className="text-sm text-gray-500">Structured data format</div>
                </div>
              </label>

              <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="exportFormat"
                  value="csv"
                  checked={exportFormat === 'csv'}
                  onChange={(e) => setExportFormat(e.target.value as 'json' | 'csv')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">CSV</div>
                  <div className="text-sm text-gray-500">Spreadsheet compatible</div>
                </div>
              </label>
            </div>
          </div>

          {/* Filename Input */}
          <div>
            <label htmlFor="filename" className="block text-sm font-medium text-gray-700 mb-2">
              Filename (optional)
            </label>
            <input
              type="text"
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder={`transactions-${new Date().toISOString().split('T')[0]}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Leave empty to use default filename
            </p>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Export Summary</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Total transactions: {transactions.length}</div>
              <div>Format: {exportFormat.toUpperCase()}</div>
              <div>Filename: {filename || `transactions-${new Date().toISOString().split('T')[0]}`}.{exportFormat}</div>
            </div>
          </div>

          {/* Export Preview */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preview (First Transaction)
            </label>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs">{getExportPreview()}</pre>
            </div>
          </div>

          {/* Error Display */}
          {exportError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Export Error</h3>
                  <div className="mt-1 text-sm text-red-700">{exportError}</div>
                </div>
              </div>
            </div>
          )}

          {/* Export Button */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleExport}
              disabled={isExporting || transactions.length === 0}
              className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Exporting...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export Data
                </>
              )}
            </button>

            <div className="text-sm text-gray-500">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} ready to export
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 