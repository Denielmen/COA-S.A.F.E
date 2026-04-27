const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Configuration
const CONFIG = {
    articles: {
        file: 'public/dailyArticles.xlsx',
        columns: ['Title', 'Description', 'FullContent', 'AdditionalContent', 'RewardTitle', 'RewardMessage']
    },
    quizzes: {
        file: 'public/quizzes.xlsx',
        columns: ['QuizTitle', 'QuizDescription', 'Question', 'Option1', 'Option2', 'Option3', 'Option4', 'Explanation']
    },
    languages: [
        { code: 'tl', name: 'Tagalog' },
        { code: 'ceb', name: 'Bisaya', suffix: 'BIS' } // Google Translate uses 'ceb' for Cebuano
    ]
};

/**
 * Simple unofficial Google Translate fetcher
 */
async function translate(text, targetLang) {
    if (!text || typeof text !== 'string' || text.trim() === '') return text;
    
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        return data[0].map(item => item[0]).join('');
    } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error.message);
        return text;
    }
}

async function processFile(fileConfig) {
    const filePath = path.resolve(process.cwd(), fileConfig.file);
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return;
    }

    console.log(`Processing ${fileConfig.file}...`);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
        console.log('No data found in sheet.');
        return;
    }

    const totalRows = data.length;
    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        process.stdout.write(`  Progress: ${i + 1}/${totalRows}\r`);

        for (const lang of CONFIG.languages) {
            const suffix = lang.suffix || lang.code.toUpperCase();
            
            for (const col of fileConfig.columns) {
                const targetCol = `${col}_${suffix}`;
                
                // Only translate if target column is empty or we want to overwrite
                if (!row[targetCol] && row[col]) {
                    row[targetCol] = await translate(row[col], lang.code);
                }
            }
        }
    }
    console.log(`\n  Done translating ${fileConfig.file}.`);

    // Convert back to worksheet
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = newWorksheet;

    // Save back to file
    XLSX.writeFile(workbook, filePath);
    console.log(`  Saved updates to ${fileConfig.file}\n`);
}

async function main() {
    console.log('--- Project SAFE Auto-Translator ---\n');
    
    try {
        await processFile(CONFIG.articles);
        await processFile(CONFIG.quizzes);
        console.log('All translations complete! Your app is now ready for offline use.');
    } catch (error) {
        console.error('An error occurred during translation:', error);
    }
}

main();
