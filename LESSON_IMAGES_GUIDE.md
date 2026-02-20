# Lesson Images Guide

This guide explains how to add illustrations/photos to your daily lessons.

## 📁 Folder Structure

Store all lesson images in the `public/images/lessons/` folder:

```
public/
  images/
    lessons/
      month1-day1.jpg
      month1-day2.png
      month2-day1.jpg
      ...
```

## 📝 How to Add Images

### Step 1: Prepare Your Images

1. **Create the folder** (if it doesn't exist):
   - Navigate to `public/images/`
   - Create a new folder called `lessons`

2. **Add your images** to `public/images/lessons/`
   - Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
   - Recommended naming: `month1-day1.jpg`, `month2-day15.png`, etc.

### Step 2: Update the Excel File

1. **Open** `public/dailyArticles.xlsx`

2. **Add the ImagePath column** (if not already present):
   - Add a new column header: `ImagePath`

3. **Fill in the image paths** for each lesson:
   - Example: `/images/lessons/month1-day1.jpg`
   - Example: `/images/lessons/month2-day15.png`
   - Leave blank if no image for that lesson

4. **Save** the Excel file

### Step 3: Reload the App

1. **Refresh** your browser
2. The images should now appear in the lessons!

## 📋 Example Excel Entries

| Day | Month | Title | Description | ImagePath |
|-----|-------|-------|-------------|-----------|
| 1 | 1 | Children's Rights | Learn about basic rights | /images/lessons/month1-day1.jpg |
| 2 | 1 | Right to Education | Every child deserves education | /images/lessons/month1-day2.png |
| 3 | 1 | Protection | Children need protection | |

## 🎨 Image Recommendations

- **Size**: Recommended width 800-1200px for good quality
- **Aspect Ratio**: 16:9 or 4:3 works best
- **File Size**: Keep under 500KB for faster loading
- **Format**: JPG for photos, PNG for graphics with transparency

## ⚠️ Troubleshooting

### Image not showing?

1. **Check the path** in Excel - must start with `/images/lessons/`
2. **Check the file exists** in `public/images/lessons/`
3. **Check the filename** matches exactly (case-sensitive)
4. **Clear browser cache** and refresh

### Image shows placeholder?

- The lesson doesn't have an `ImagePath` in the Excel file
- This is normal - not all lessons need images

## 🔄 Updating Images

To change an image:
1. Replace the image file in `public/images/lessons/`
2. Keep the same filename, OR
3. Update the `ImagePath` in the Excel file with the new filename
4. Refresh the browser

## 💡 Tips

- Use descriptive filenames: `child-protection.jpg` instead of `img1.jpg`
- Organize by month if you have many images: `month1/day1.jpg`
- Compress images before uploading to reduce file size
- Use consistent image styles for a professional look

