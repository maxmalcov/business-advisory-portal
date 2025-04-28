import {logsTable} from "@/integrations/supabase/client.ts";

export const exportToCSV = async () => {
    try {
        const response = await logsTable().select('*')
        const data = response.data;

        const csvRows = [];
        const headers = Object.keys(data[0]);

        csvRows.push('logs');

        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => `"${row[header]}"`);
            csvRows.push(values.join(','));
        }

        const csvString = csvRows.join('\n');

        const blob = new Blob([csvString], { type: 'text/csv' });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'logs.csv';
        a.click();

        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error exporting data:', error);
    }
};
