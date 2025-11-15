# Excel-Based Content Management

## Overview
Both daily articles and quiz data have been converted from hardcoded TypeScript arrays to an Excel-based management system. This allows for easier content management by non-technical users.

## Files Structure
```
src/
├── data/
│   ├── dailyArticles.ts          # Updated to use Excel reader
│   └── quizzes.ts                # Updated to use Excel reader
├── utils/
│   ├── excelReader.ts            # Excel file reading utilities for articles
│   └── quizExcelReader.ts        # Excel file reading utilities for quizzes
public/
├── dailyArticles.xlsx            # Main Excel data file for articles
└── quizzes.xlsx                  # Main Excel data file for quizzes
```

## Excel File Formats

### Daily Articles (`dailyArticles.xlsx`)
| Column | Type | Description |
|--------|------|-------------|
| Day | Number | Day of the month (1-31) |
| Month | Number | Month number (1-12) |
| Title | Text | Article title |
| Description | Text | Short description |
| FullContent | Text | Full article content (optional) |
| ExternalLink | Text | External URL (optional) |
| ChallengeType | Text | 'individual', 'family', or 'social-media' |
| IsRewardDay | Text | 'TRUE' or 'FALSE' |
| RewardTitle | Text | Reward title (if reward day) |
| RewardMessage | Text | Reward message (if reward day) |

### Quizzes (`quizzes.xlsx`)
| Column | Type | Description |
|--------|------|-------------|
| Month | Number | Month number (1-12) |
| QuizTitle | Text | Title of the quiz for that month |
| QuizDescription | Text | Description of the quiz |
| PassingScore | Number | Percentage needed to pass (e.g., 70) |
| QuestionId | Number | Question number within the quiz (1, 2, 3, etc.) |
| Question | Text | The quiz question text |
| Option1 | Text | First answer choice |
| Option2 | Text | Second answer choice |
| Option3 | Text | Third answer choice |
| Option4 | Text | Fourth answer choice |
| CorrectAnswer | Number | Index of correct answer (0=Option1, 1=Option2, 2=Option3, 3=Option4) |
| Explanation | Text | Explanation of the correct answer |

## How to Update Content

### 1. Edit Excel File
1. Open `public/dailyArticles.xlsx` in Excel or Google Sheets
2. Edit the content directly in the spreadsheet
3. Save the file

### 2. Refresh Application
The application will automatically load the updated data when:
- The page is refreshed
- The `reloadArticles()` function is called

### 3. Add New Articles
1. Add new rows to the Excel file
2. Fill in all required columns (Day, Month, Title, Description, ChallengeType)
3. Optional columns can be left empty
4. Save the file

## Development Commands

### Generate New Excel Template
```bash
node scripts/createExcel.js
```

### Clear Cache (in browser console)
```javascript
import { clearArticlesCache, reloadArticles } from './src/data/dailyArticles';
clearArticlesCache();
reloadArticles();
```

## Benefits

✅ **Easy Content Management** - Edit directly in Excel/Google Sheets  
✅ **Non-Technical Friendly** - No coding required for content updates  
✅ **Version Control** - Track changes in Excel file  
✅ **Bulk Operations** - Sort, filter, and manage large datasets  
✅ **Backup & Sharing** - Easy to backup and share Excel files  
✅ **Fallback System** - App continues working even if Excel file fails  

## Technical Implementation

### Caching System
- Articles are cached in memory after first load
- Cache can be cleared manually for development
- Automatic fallback to minimal data if Excel file fails

### Error Handling
- Graceful fallback to hardcoded minimal data
- Console logging for debugging
- User-friendly error messages

### Performance
- Single file read on application start
- In-memory caching for fast access
- Minimal impact on application performance

## Migration Notes

The original hardcoded data has been preserved as fallback data. The application will:
1. Try to load from Excel file first
2. Fall back to minimal hardcoded data if Excel fails
3. Log appropriate messages for debugging

This ensures the application remains functional even if there are issues with the Excel file.
