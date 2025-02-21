export async function fetchGTFSData(filePath: string): Promise<any> {
    const response = await fetch(filePath);
    const text = await response.text();
    return parseCSVToJSON(text);
}

function parseCSVToJSON(csvText: string): any[] {
    const rows = csvText.split("\n");
    const headers = rows[0].split(",");
    const data = rows.slice(1).map((row: string) => {
        const values = row.split(",");
        let obj: { [key: string]: string } = {};
        headers.forEach((header: string, index: number) => {
            obj[header] = values[index];
        });
        return obj;
    });
    return data;
}