# Updating Job Fields in Opportometry

## When to Update Different Files
| **Change**                        | **Files to Update**                                  |
|-----------------------------------|--------------------------------------------------|
| Add/Remove a Job Field            | `models/Job.js`, `routes/jobs.js`, `AddJob.jsx`, `JobList.jsx` |
| Make a Field Required/Optional    | `models/Job.js`, `routes/jobs.js`                |
| Update Job Form Inputs (Frontend) | `AddJob.jsx`                                      |
| Change Job Display (Frontend)     | `JobList.jsx`                                    |

## Steps to Apply Changes
1. **Update the necessary files based on the table above**.
2. **Restart your backend (`node server.js`) and frontend (`npm start`)**.
3. **Test by submitting and retrieving jobs**.


# Updating Job Fields in Opportometry

## When to Update Different Files

|   |
| - |

| **Change**                        | **Files to Update**                                            |
| --------------------------------- | -------------------------------------------------------------- |
| Add/Remove a Job Field            | `models/Job.js`, `routes/jobs.js`, `AddJob.jsx`, `JobList.jsx` |
| Make a Field Required/Optional    | `models/Job.js`, `routes/jobs.js`                              |
| Update Job Form Inputs (Frontend) | `AddJob.jsx`                                                   |
| Change Job Display (Frontend)     | `JobList.jsx`                                                  |

## Steps to Apply Changes

1. **Update the necessary files based on the table above**.
2. **Restart your backend (**``**) and frontend (**``**)**.
3. **Test by submitting and retrieving jobs**.

## Example: Making `practiceMode` Optional

### **1️⃣ Modify **``

Find this line:

```javascript
practiceMode: { type: String, enum: ["employed", "contract", "lease", "associate"], required: true },
```

Replace with:

```javascript
practiceMode: { type: String, enum: ["employed", "contract", "lease", "associate"], default: null },
```

### **2️⃣ Modify **``

Find:

```javascript
const { title, description, company, practiceMode, corporation = null } = req.body;
```

Replace with:

```javascript
const { title, description, company, corporation = null } = req.body;
const practiceMode = req.body.practiceMode || null; // Default to null if missing
```

### **3️⃣ Restart Backend and Test Again**

```bash
node server.js
```

Then test posting a job:

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Surgeon",
    "description": "Fix stuff",
    "company": "Delta",
    "location": "Toronto",
    "salary": "100k"
  }'
```

✅ **Expected Output:**

```json
{
  "message": "Job posted successfully!",
  "job": {
    "_id": "65e4b12345b6cdef7890abcd",
    "title": "Surgeon",
    "description": "Fix stuff",
    "company": "Delta",
    "location": "Toronto",
    "salary": "100k",
    "practiceMode": null,
    "createdAt": "2025-02-19T12:00:00Z"
  }
}
```

