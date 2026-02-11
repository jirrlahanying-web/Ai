/**
 * ============================================
 * CodeAI Pro - API Server (Mock)
 * Simulates AI API with coding-specialized responses
 * ============================================
 */

class APIServer {
    constructor() {
        this.baseDelay = 500;
        this.typingSpeed = 30; // ms per character
        this.isProcessing = false;
        this.abortController = null;
        
        // Coding knowledge base
        this.knowledgeBase = this.initKnowledgeBase();
    }

    /**
     * Initialize knowledge base for coding responses
     */
    initKnowledgeBase() {
        return {
            greetings: [
                'Halo! Saya CodeAI Pro, asisten AI khusus coding. Ada yang bisa saya bantu?',
                'Selamat datang! Saya siap membantu dengan kebutuhan coding Anda.',
                'Hai! Mau belajar coding atau butuh bantuan dengan projek Anda?'
            ],
            
            codeTemplates: {
                javascript: {
                    calculator: `// Kalkulator Sederhana
function calculator() {
    const num1 = parseFloat(prompt('Masukkan angka pertama:'));
    const operator = prompt('Masukkan operator (+, -, *, /):');
    const num2 = parseFloat(prompt('Masukkan angka kedua:'));
    
    let result;
    switch(operator) {
        case '+': result = num1 + num2; break;
        case '-': result = num1 - num2; break;
        case '*': result = num1 * num2; break;
        case '/': result = num2 !== 0 ? num1 / num2 : 'Error: Division by zero'; break;
        default: result = 'Operator tidak valid';
    }
    
    console.log(\`Hasil: \${result}\`);
    return result;
}

calculator();`,

                    todoList: `// Todo List App
class TodoList {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
    }
    
    add(text) {
        const todo = {
            id: Date.now(),
            text,
            completed: false,
            createdAt: new Date()
        };
        this.todos.push(todo);
        this.save();
        return todo;
    }
    
    toggle(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
        }
    }
    
    delete(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
    }
    
    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
    
    getAll() {
        return this.todos;
    }
}

const todoList = new TodoList();`,

                    fetchAPI: `// Fetch API Example
async function fetchData(url) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const data = await response.json();
        console.log('Data fetched:', data);
        return data;
        
    } catch (error) {
        console.error('Fetch error:', error.message);
        throw error;
    }
}

// Usage
fetchData('https://api.example.com/data')
    .then(data => console.log(data))
    .catch(err => console.error(err));`
                },

                python: {
                    calculator: `# Kalkulator Python
def calculator():
    try:
        num1 = float(input("Masukkan angka pertama: "))
        operator = input("Masukkan operator (+, -, *, /): ")
        num2 = float(input("Masukkan angka kedua: "))
        
        if operator == '+':
            result = num1 + num2
        elif operator == '-':
            result = num1 - num2
        elif operator == '*':
            result = num1 * num2
        elif operator == '/':
            result = num1 / num2 if num2 != 0 else "Error: Division by zero"
        else:
            result = "Operator tidak valid"
        
        print(f"Hasil: {result}")
        return result
        
    except ValueError:
        print("Error: Masukkan angka yang valid")
        return None

calculator()`,

                    fileHandler: `# File Handler Python
import os
import json

class FileHandler:
    def __init__(self, filename):
        self.filename = filename
    
    def write(self, data):
        """Write data to file"""
        with open(self.filename, 'w', encoding='utf-8') as f:
            if isinstance(data, dict):
                json.dump(data, f, indent=2)
            else:
                f.write(str(data))
        print(f"Data saved to {self.filename}")
    
    def read(self):
        """Read data from file"""
        if not os.path.exists(self.filename):
            return None
        
        with open(self.filename, 'r', encoding='utf-8') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return f.read()
    
    def append(self, data):
        """Append data to file"""
        with open(self.filename, 'a', encoding='utf-8') as f:
            f.write(str(data) + '\\n')
    
    def delete(self):
        """Delete file"""
        if os.path.exists(self.filename):
            os.remove(self.filename)
            print(f"File {self.filename} deleted")

# Usage
handler = FileHandler('data.txt')
handler.write({'name': 'John', 'age': 30})
data = handler.read()
print(data)`,

                    dataAnalysis: `# Data Analysis with Pandas
import pandas as pd
import matplotlib.pyplot as plt

def analyze_data(csv_file):
    # Read data
    df = pd.read_csv(csv_file)
    
    # Basic statistics
    print("=== Basic Statistics ===")
    print(df.describe())
    
    # Missing values
    print("\\n=== Missing Values ===")
    print(df.isnull().sum())
    
    # Data types
    print("\\n=== Data Types ===")
    print(df.dtypes)
    
    # Correlation matrix
    print("\\n=== Correlation Matrix ===")
    print(df.corr())
    
    # Visualize
    df.hist(figsize=(10, 8))
    plt.tight_layout()
    plt.show()
    
    return df

# Usage
df = analyze_data('data.csv')`
                },

                html: {
                    portfolio: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portfolio Saya</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 4rem 2rem;
        }
        
        header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        .projects {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }
        
        .project-card {
            background: white;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 1.5rem;
            transition: transform 0.3s;
        }
        
        .project-card:hover {
            transform: translateY(-5px);
        }
        
        footer {
            background: #333;
            color: white;
            text-align: center;
            padding: 2rem;
            margin-top: 3rem;
        }
    </style>
</head>
<body>
    <header>
        <h1>Nama Anda</h1>
        <p>Web Developer | Designer | Creator</p>
    </header>
    
    <div class="container">
        <h2>Tentang Saya</h2>
        <p>Saya adalah seorang developer yang passionate dalam membuat web yang menarik dan fungsional.</p>
        
        <h2>Projek Saya</h2>
        <div class="projects">
            <div class="project-card">
                <h3>Projek 1</h3>
                <p>Deskripsi projek pertama Anda.</p>
            </div>
            <div class="project-card">
                <h3>Projek 2</h3>
                <p>Deskripsi projek kedua Anda.</p>
            </div>
        </div>
    </div>
    
    <footer>
        <p>&copy; 2024 Nama Anda. All rights reserved.</p>
    </footer>
</body>
</html>`,

                    loginForm: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            width: 100%;
            max-width: 400px;
        }
        
        .login-container h2 {
            text-align: center;
            margin-bottom: 2rem;
            color: #333;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #667eea;
        }
        
        button {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: transform 0.3s;
        }
        
        button:hover {
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>Login</h2>
        <form id="loginForm">
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
    </div>
    
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            console.log('Login attempt:', { email, password });
            alert('Login berhasil!');
        });
    </script>
</body>
</html>`
                },

                css: {
                    animations: `/* Animasi CSS Collection */

/* Fade In */
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.fade-in {
    animation: fadeIn 0.5s ease;
}

/* Slide In */
@keyframes slideIn {
    from { 
        opacity: 0;
        transform: translateX(-50px);
    }
    to { 
        opacity: 1;
        transform: translateX(0);
    }
}

.slide-in {
    animation: slideIn 0.5s ease;
}

/* Bounce */
@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

.bounce {
    animation: bounce 1s ease infinite;
}

/* Pulse */
@keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
}

.pulse {
    animation: pulse 1s ease infinite;
}

/* Spin */
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.spin {
    animation: spin 1s linear infinite;
}

/* Shake */
@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

.shake {
    animation: shake 0.5s ease;
}

/* Gradient Animation */
@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.animated-gradient {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

/* Loading Spinner */
.spinner {
    width: 50px;
    height: 50px;
    border: 5px solid #f3f3f3;
    border-top: 5px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

/* Hover Effects */
.hover-lift {
    transition: transform 0.3s, box-shadow 0.3s;
}

.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
}

.hover-scale {
    transition: transform 0.3s;
}

.hover-scale:hover {
    transform: scale(1.05);
}

/* Glassmorphism */
.glass {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
}`,

                    responsive: `/* Responsive Design Template */

/* Mobile First Approach */
.container {
    width: 100%;
    padding: 0 15px;
    margin: 0 auto;
}

/* Small devices (phones, 576px and up) */
@media (min-width: 576px) {
    .container {
        max-width: 540px;
    }
}

/* Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
    .container {
        max-width: 720px;
    }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
    .container {
        max-width: 960px;
    }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
    .container {
        max-width: 1140px;
    }
}

/* Grid System */
.row {
    display: flex;
    flex-wrap: wrap;
    margin: 0 -15px;
}

.col {
    flex: 1;
    padding: 0 15px;
}

.col-12 { flex: 0 0 100%; max-width: 100%; }
.col-6 { flex: 0 0 50%; max-width: 50%; }
.col-4 { flex: 0 0 33.333%; max-width: 33.333%; }
.col-3 { flex: 0 0 25%; max-width: 25%; }

@media (min-width: 768px) {
    .col-md-6 { flex: 0 0 50%; max-width: 50%; }
    .col-md-4 { flex: 0 0 33.333%; max-width: 33.333%; }
    .col-md-3 { flex: 0 0 25%; max-width: 25%; }
}

/* Utility Classes */
.d-none { display: none !important; }
.d-block { display: block !important; }
.d-flex { display: flex !important; }

@media (min-width: 768px) {
    .d-md-none { display: none !important; }
    .d-md-block { display: block !important; }
    .d-md-flex { display: flex !important; }
}`
                },

                sql: {
                    basic: `-- Query SQL Dasar

-- Membuat database
CREATE DATABASE IF NOT EXISTS my_database;
USE my_database;

-- Membuat tabel
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Membuat tabel posts
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert data
INSERT INTO users (username, email, password, full_name) VALUES
('john_doe', 'john@example.com', 'hashed_password', 'John Doe'),
('jane_smith', 'jane@example.com', 'hashed_password', 'Jane Smith');

-- Select dengan JOIN
SELECT 
    u.id,
    u.username,
    u.email,
    p.title,
    p.status,
    p.created_at
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.is_active = TRUE
ORDER BY p.created_at DESC
LIMIT 10;

-- Update data
UPDATE users 
SET full_name = 'John Updated', 
    updated_at = NOW() 
WHERE id = 1;

-- Delete data
DELETE FROM posts WHERE status = 'archived' AND created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Aggregate functions
SELECT 
    status,
    COUNT(*) as total_posts,
    AVG(LENGTH(content)) as avg_content_length
FROM posts
GROUP BY status
HAVING COUNT(*) > 5
ORDER BY total_posts DESC;`,

                    advanced: `-- Query SQL Lanjutan

-- Subquery
SELECT * FROM users 
WHERE id IN (
    SELECT user_id 
    FROM posts 
    GROUP BY user_id 
    HAVING COUNT(*) > 5
);

-- Common Table Expression (CTE)
WITH user_stats AS (
    SELECT 
        user_id,
        COUNT(*) as post_count,
        MAX(created_at) as last_post_date
    FROM posts
    GROUP BY user_id
)
SELECT 
    u.username,
    u.email,
    COALESCE(us.post_count, 0) as total_posts,
    us.last_post_date
FROM users u
LEFT JOIN user_stats us ON u.id = us.user_id;

-- Window Functions
SELECT 
    id,
    title,
    user_id,
    created_at,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as post_rank,
    COUNT(*) OVER (PARTITION BY user_id) as total_user_posts,
    LAG(title) OVER (PARTITION BY user_id ORDER BY created_at) as previous_post
FROM posts;

-- Full-text search
CREATE FULLTEXT INDEX idx_content ON posts(title, content);

SELECT * FROM posts 
WHERE MATCH(title, content) AGAINST('javascript tutorial' IN NATURAL LANGUAGE MODE);

-- Transaction
START TRANSACTION;

INSERT INTO users (username, email, password) 
VALUES ('new_user', 'new@example.com', 'password');

SET @user_id = LAST_INSERT_ID();

INSERT INTO posts (user_id, title, content) 
VALUES (@user_id, 'First Post', 'Hello World!');

COMMIT;
-- atau ROLLBACK jika terjadi error`
                }
            },

            explanations: {
                javascript: {
                    variables: `## Variabel di JavaScript

JavaScript memiliki tiga cara mendeklarasikan variabel:

### 1. \`var\` (Function Scope)
- Dapat dideklarasikan ulang
- Dapat diubah nilainya
- Hoisted ke atas scope

### 2. \`let\` (Block Scope)
- Tidak dapat dideklarasikan ulang
- Dapat diubah nilainya
- Tidak hoisted

### 3. \`const\` (Block Scope)
- Tidak dapat dideklarasikan ulang
- Tidak dapat diubah nilainya (immutable reference)
- Tidak hoisted

**Rekomendasi:** Gunakan \`const\` secara default, \`let\` jika perlu reassign. Hindari \`var\`.`,

                    async: `## Async/Await di JavaScript

Async/await adalah sintaks modern untuk menangani operasi asynchronous:

### Keuntungan:
- Kode lebih mudah dibaca
- Seperti synchronous code
- Error handling dengan try/catch

### Cara kerja:
1. \`async\` membuat function mengembalikan Promise
2. \`await\` menunggu Promise selesai
3. Error ditangkap dengan try/catch`,

                    dom: `## DOM Manipulation

DOM (Document Object Model) adalah representasi struktur HTML:

### Method utama:
- \`getElementById()\` - Ambil elemen by ID
- \`querySelector()\` - Ambil elemen dengan CSS selector
- \`querySelectorAll()\` - Ambil semua elemen yang cocok
- \`createElement()\` - Buat elemen baru
- \`appendChild()\` - Tambahkan elemen ke parent

### Event Handling:
- \`addEventListener()\` - Tambahkan event listener
- \`removeEventListener()\` - Hapus event listener`
                },

                react: {
                    hooks: `## React Hooks

Hooks memungkinkan functional components menggunakan state dan lifecycle:

### useState
- Mengelola state dalam component
- Mengembalikan [value, setter]

### useEffect
- Menangani side effects
- Bisa sebagai componentDidMount, componentDidUpdate, componentWillUnmount

### useContext
- Mengakses React Context
- Hindari prop drilling

### useRef
- Mengakses DOM elements
- Menyimpan nilai mutable

### Custom Hooks
- Buat hook sendiri untuk logic reusable`,

                    components: `## React Components

### Functional Components
- Function yang mengembalikan JSX
- Lebih simple dan readable
- Bisa menggunakan Hooks

### Class Components
- ES6 Class yang extends React.Component
- Punya lifecycle methods
- Lebih verbose

### Props
- Data yang diteruskan ke component
- Read-only
- Bisa berupa string, number, object, function

### State
- Data internal component
- Mutable dengan setter
- Trigger re-render saat berubah`
                },

                python: {
                    basics: `## Dasar Python

Python adalah bahasa pemrograman yang:
- Mudah dibaca (readable syntax)
- Interpreted (tidak perlu compile)
- Dynamically typed
- Multi-paradigm (OOP, functional, procedural)

### Karakteristik:
- Indentation-sensitive
- No semicolons needed
- Dynamic typing
- Garbage collected`,

                    oop: `## OOP di Python

### Class
Blueprint untuk membuat objects

### Object
Instance dari class

### Inheritance
Pewarisan dari parent class

### Encapsulation
Data hiding dengan private attributes

### Polymorphism
Same interface, different implementation

### Method Types:
- Instance method (self)
- Class method (cls)
- Static method (no self/cls)`
                },

                general: {
                    debugging: `## Tips Debugging

### 1. Console Logging
Gunakan \`console.log()\` untuk melacak nilai variabel

### 2. Debugger
Gunakan statement \`debugger;\` untuk breakpoint

### 3. Error Messages
Baca pesan error dengan teliti:
- TypeError: Tipe data salah
- ReferenceError: Variabel tidak ditemukan
- SyntaxError: Kesalahan sintaks

### 4. Stack Trace
Ikuti urutan eksekusi dari error

### 5. Isolate Problem
Buat minimal reproducible example`,

                    bestPractices: `## Best Practices Coding

### 1. DRY (Don't Repeat Yourself)
Hindari duplikasi kode

### 2. KISS (Keep It Simple, Stupid)
Kode se-simple mungkin

### 3. Single Responsibility
Satu function/class = satu tugas

### 4. Meaningful Names
Nama variabel/function yang deskriptif

### 5. Comments
Jelaskan "kenapa" bukan "apa"

### 6. Error Handling
Tangani error dengan graceful

### 7. Testing
Tulis unit tests

### 8. Version Control
Gunakan Git dengan baik`
                }
            }
        };
    }

    /**
     * Send message to AI
     * @param {string} message - User message
     * @param {Array} history - Chat history
     * @returns {Promise<object>} AI response
     */
    async sendMessage(message, history = []) {
        if (this.isProcessing) {
            throw new Error('Already processing a message');
        }

        this.isProcessing = true;
        this.abortController = new AbortController();

        try {
            // Simulate network delay
            await this.simulateDelay(this.baseDelay + Math.random() * 1000);

            // Check if aborted
            if (this.abortController.signal.aborted) {
                throw new Error('Request aborted');
            }

            // Generate response
            const response = this.generateResponse(message, history);

            // Simulate typing delay
            const typingDelay = response.content.length * this.typingSpeed;
            await this.simulateDelay(Math.min(typingDelay, 5000));

            this.isProcessing = false;
            return response;

        } catch (error) {
            this.isProcessing = false;
            throw error;
        }
    }

    /**
     * Generate AI response based on message
     * @param {string} message - User message
     * @param {Array} history - Chat history
     * @returns {object} Response object
     */
    generateResponse(message, history) {
        const lowerMsg = message.toLowerCase();
        
        // Check for greetings
        if (this.isGreeting(lowerMsg)) {
            return this.createResponse(Utils.randomItem(this.knowledgeBase.greetings));
        }

        // Check for code generation requests
        if (this.isCodeRequest(lowerMsg)) {
            return this.handleCodeRequest(message, lowerMsg);
        }

        // Check for explanation requests
        if (this.isExplanationRequest(lowerMsg)) {
            return this.handleExplanationRequest(message, lowerMsg);
        }

        // Check for debugging help
        if (this.isDebugRequest(lowerMsg)) {
            return this.handleDebugRequest(message);
        }

        // Check for optimization requests
        if (this.isOptimizationRequest(lowerMsg)) {
            return this.handleOptimizationRequest(message);
        }

        // Default response
        return this.createDefaultResponse(message);
    }

    /**
     * Check if message is a greeting
     */
    isGreeting(message) {
        const greetings = ['halo', 'hai', 'hello', 'hi', 'hey', 'selamat'];
        return greetings.some(g => message.includes(g)) && message.length < 30;
    }

    /**
     * Check if message is a code request
     */
    isCodeRequest(message) {
        const patterns = [
            'buat', 'buatkan', 'create', 'generate', 'code', 'kode',
            'script', 'program', 'aplikasi', 'website', 'web'
        ];
        return patterns.some(p => message.includes(p));
    }

    /**
     * Check if message is an explanation request
     */
    isExplanationRequest(message) {
        const patterns = [
            'jelaskan', 'explain', 'apa itu', 'what is', 'bagaimana', 'how to',
            'mengapa', 'why', 'perbedaan', 'difference', 'cara kerja'
        ];
        return patterns.some(p => message.includes(p));
    }

    /**
     * Check if message is a debug request
     */
    isDebugRequest(message) {
        const patterns = [
            'error', 'bug', 'debug', 'fix', 'perbaiki', 'tidak jalan',
            'not working', 'failed', 'gagal', 'issue', 'problem'
        ];
        return patterns.some(p => message.includes(p));
    }

    /**
     * Check if message is an optimization request
     */
    isOptimizationRequest(message) {
        const patterns = [
            'optimasi', 'optimize', 'improve', 'percepat', 'lebih cepat',
            'efisien', 'efficient', 'refactor', 'clean code'
        ];
        return patterns.some(p => message.includes(p));
    }

    /**
     * Handle code generation request
     */
    handleCodeRequest(message, lowerMsg) {
        let language = 'javascript';
        let template = null;

        // Detect language
        if (lowerMsg.includes('python') || lowerMsg.includes('.py')) {
            language = 'python';
        } else if (lowerMsg.includes('html')) {
            language = 'html';
        } else if (lowerMsg.includes('css')) {
            language = 'css';
        } else if (lowerMsg.includes('sql') || lowerMsg.includes('database')) {
            language = 'sql';
        }

        // Detect template type
        if (lowerMsg.includes('kalkulator') || lowerMsg.includes('calculator')) {
            template = 'calculator';
        } else if (lowerMsg.includes('todo') || lowerMsg.includes('list')) {
            template = language === 'python' ? 'fileHandler' : 'todoList';
        } else if (lowerMsg.includes('portfolio') || lowerMsg.includes('website')) {
            template = 'portfolio';
        } else if (lowerMsg.includes('login') || lowerMsg.includes('form')) {
            template = 'loginForm';
        } else if (lowerMsg.includes('api') || lowerMsg.includes('fetch')) {
            template = 'fetchAPI';
        } else if (lowerMsg.includes('animasi') || lowerMsg.includes('animation')) {
            template = 'animations';
        } else if (lowerMsg.includes('responsive')) {
            template = 'responsive';
        } else if (lowerMsg.includes('data') || lowerMsg.includes('analisis')) {
            template = 'dataAnalysis';
        } else if (lowerMsg.includes('query') || lowerMsg.includes('database')) {
            template = lowerMsg.includes('advanced') ? 'advanced' : 'basic';
        }

        // Get code template
        let code = '';
        if (template && this.knowledgeBase.codeTemplates[language]?.[template]) {
            code = this.knowledgeBase.codeTemplates[language][template];
        } else {
            // Generate generic response
            code = this.generateGenericCode(language, message);
        }

        const response = `Berikut adalah kode ${language.toUpperCase()} yang Anda minta:

\`\`\`${language}
${code}
\`\`\`

**Penjelasan:**
- Kode ini sudah lengkap dengan komentar
- Anda bisa langsung copy dan paste
- Jika ada pertanyaan, silakan tanya!`;

        return this.createResponse(response, [{
            language,
            code
        }]);
    }

    /**
     * Handle explanation request
     */
    handleExplanationRequest(message, lowerMsg) {
        let topic = 'general';
        let subtopic = 'bestPractices';

        // Detect topic
        if (lowerMsg.includes('javascript') || lowerMsg.includes('js')) {
            topic = 'javascript';
            if (lowerMsg.includes('variabel') || lowerMsg.includes('variable') || 
                lowerMsg.includes('let') || lowerMsg.includes('const') || lowerMsg.includes('var')) {
                subtopic = 'variables';
            } else if (lowerMsg.includes('async') || lowerMsg.includes('await') || 
                       lowerMsg.includes('promise')) {
                subtopic = 'async';
            } else if (lowerMsg.includes('dom') || lowerMsg.includes('document')) {
                subtopic = 'dom';
            }
        } else if (lowerMsg.includes('react')) {
            topic = 'react';
            if (lowerMsg.includes('hook')) {
                subtopic = 'hooks';
            } else if (lowerMsg.includes('component')) {
                subtopic = 'components';
            }
        } else if (lowerMsg.includes('python')) {
            topic = 'python';
            if (lowerMsg.includes('oop') || lowerMsg.includes('class') || 
                lowerMsg.includes('object')) {
                subtopic = 'oop';
            } else {
                subtopic = 'basics';
            }
        } else if (lowerMsg.includes('debug') || lowerMsg.includes('error')) {
            topic = 'general';
            subtopic = 'debugging';
        }

        const explanation = this.knowledgeBase.explanations[topic]?.[subtopic] || 
                           this.knowledgeBase.explanations.general.bestPractices;

        return this.createResponse(explanation);
    }

    /**
     * Handle debug request
     */
    handleDebugRequest(message) {
        const response = `Saya akan membantu Anda debug kode tersebut. Berikut adalah langkah-langkah yang bisa dilakukan:

## 1. Identifikasi Error
- Baca pesan error dengan teliti
- Perhatikan nomor baris yang disebutkan
- Cek tipe error (TypeError, ReferenceError, dll)

## 2. Console Logging
Tambahkan \`console.log()\` di berbagai titik:
\`\`\`javascript
console.log('Nilai variabel:', variableName);
console.log('Tipe data:', typeof variableName);
console.log('Object:', JSON.stringify(obj, null, 2));
\`\`\`

## 3. Gunakan Debugger
\`\`\`javascript
function problematicFunction() {
    debugger; // Execution akan pause di sini
    // ... kode Anda
}
\`\`\`

## 4. Checklist Umum:
- [ ] Variabel sudah dideklarasikan?
- [ ] Tipe data sudah benar?
- [ ] Function sudah di-import?
- [ ] Async/await digunakan dengan benar?
- [ ] Tidak ada typo dalam nama variabel?

Silakan share kode lengkapnya agar saya bisa bantu lebih spesifik!`;

        return this.createResponse(response);
    }

    /**
     * Handle optimization request
     */
    handleOptimizationRequest(message) {
        const response = `Berikut adalah tips untuk mengoptimasi kode:

## 1. Algorithm Optimization
- Gunakan data structure yang tepat
- Hindari nested loops jika memungkinkan
- Gunakan memoization untuk function yang sering dipanggil

## 2. JavaScript Specific
\`\`\`javascript
// ❌ Buruk
for (let i = 0; i < array.length; i++) { }

// ✅ Baik
for (let i = 0, len = array.length; i < len; i++) { }
// atau
array.forEach(item => { });

// ❌ Buruk
const result = array.filter(x => x > 5).map(x => x * 2);

// ✅ Baik (single pass)
const result = array.reduce((acc, x) => {
    if (x > 5) acc.push(x * 2);
    return acc;
}, []);
\`\`\`

## 3. Memory Management
- Hapus event listener yang tidak digunakan
- Gunakan \`weakMap\` untuk cache
- Avoid memory leaks dengan closures

## 4. Loading Performance
- Lazy load components
- Code splitting
- Minimize dan compress assets

Silakan share kode spesifik yang ingin dioptimasi!`;

        return this.createResponse(response);
    }

    /**
     * Create default response
     */
    createDefaultResponse(message) {
        const responses = [
            `Saya mengerti permintaan Anda tentang "${Utils.truncate(message, 50)}". Sebagai asisten AI khusus coding, saya bisa membantu dengan:

- Membuat kode dalam berbagai bahasa
- Menjelaskan konsep programming
- Debug dan fix error
- Optimasi performa kode
- Review code Anda

Silakan berikan detail lebih lanjut atau share kode yang ingin dibahas!`,

            `Terima kasih atas pertanyaannya! Saya CodeAI Pro, asisten AI yang fokus pada coding dan programming.

Untuk pertanyaan tentang "${Utils.truncate(message, 50)}", saya butuh informasi lebih detail. Bisa tolong jelaskan:
1. Bahasa pemrograman yang digunakan?
2. Apa tujuan akhirnya?
3. Ada error message tertentu?`,

            `Halo! Saya siap membantu dengan kebutuhan coding Anda. 🚀

Untuk "${Utils.truncate(message, 50)}", saya bisa:
- Buatkan contoh kode
- Jelaskan konsep terkait
- Bantu debug jika ada masalah

Silakan elaborasi lebih lanjut ya!`
        ];

        return this.createResponse(Utils.randomItem(responses));
    }

    /**
     * Generate generic code
     */
    generateGenericCode(language, message) {
        const templates = {
            javascript: `// Generated JavaScript Code
function main() {
    console.log("Hello, World!");
    
    // TODO: Implement your logic here
    const message = "Code generated by CodeAI Pro";
    
    return message;
}

// Run the function
main();`,

            python: `# Generated Python Code
def main():
    print("Hello, World!")
    
    # TODO: Implement your logic here
    message = "Code generated by CodeAI Pro"
    
    return message

# Run the function
if __name__ == "__main__":
    main()`,

            html: `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated by CodeAI Pro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>Generated by CodeAI Pro</p>
    
    <script>
        console.log("Page loaded successfully!");
    </script>
</body>
</html>`,

            css: `/* Generated CSS */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}`,

            sql: `-- Generated SQL
-- Create a sample table
CREATE TABLE IF NOT EXISTS sample_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO sample_table (name) VALUES 
    ('Sample 1'),
    ('Sample 2'),
    ('Sample 3');

-- Select all data
SELECT * FROM sample_table;`
        };

        return templates[language] || templates.javascript;
    }

    /**
     * Create response object
     */
    createResponse(content, codeBlocks = []) {
        return {
            id: Utils.generateId(),
            role: 'assistant',
            content: content,
            timestamp: new Date().toISOString(),
            codeBlocks: codeBlocks,
            tokens: Math.ceil(content.length / 4) // Rough estimate
        };
    }

    /**
     * Simulate network delay
     */
    simulateDelay(ms) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, ms);
            
            if (this.abortController) {
                this.abortController.signal.addEventListener('abort', () => {
                    clearTimeout(timeout);
                    reject(new Error('Aborted'));
                });
            }
        });
    }

    /**
     * Abort current request
     */
    abort() {
        if (this.abortController) {
            this.abortController.abort();
            this.isProcessing = false;
        }
    }

    /**
     * Check if currently processing
     */
    isBusy() {
        return this.isProcessing;
    }

    /**
     * Set typing speed
     */
    setTypingSpeed(speed) {
        this.typingSpeed = speed;
    }

    /**
     * Set base delay
     */
    setBaseDelay(delay) {
        this.baseDelay = delay;
    }
}

// Create global instance
const apiServer = new APIServer();
