# gabiggio.github.io

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My GitHub Pages Site</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }

        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }

        header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            animation: fadeInDown 1s ease;
        }

        header p {
            font-size: 1.3rem;
            opacity: 0.9;
            animation: fadeInUp 1s ease;
        }

        nav {
            background: #2d3748;
            padding: 1rem;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        nav ul {
            list-style: none;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 2rem;
        }

        nav a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;
        }

        nav a:hover {
            color: #667eea;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }

        section {
            margin-bottom: 4rem;
        }

        section h2 {
            font-size: 2.5rem;
            margin-bottom: 1.5rem;
            color: #2d3748;
            border-bottom: 3px solid #667eea;
            padding-bottom: 0.5rem;
        }

        .card-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .card {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0,0,0,0.2);
        }

        .card h3 {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .btn {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 0.8rem 2rem;
            text-decoration: none;
            border-radius: 5px;
            transition: background 0.3s;
            margin-top: 1rem;
        }

        .btn:hover {
            background: #764ba2;
        }

        footer {
            background: #2d3748;
            color: white;
            text-align: center;
            padding: 2rem;
            margin-top: 4rem;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            header h1 {
                font-size: 2rem;
            }

            header p {
                font-size: 1rem;
            }

            nav ul {
                gap: 1rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>Welcome to My Site</h1>
        <p>Building amazing things with code</p>
    </header>

    <nav>
        <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </nav>

    <div class="container">
        <section id="about">
            <h2>About Me</h2>
            <p>Hello! I'm a developer passionate about creating web experiences. This is my personal space on the internet where I share my projects and thoughts.</p>
            <p style="margin-top: 1rem;">Feel free to explore and get in touch if you'd like to collaborate!</p>
        </section>

        <section id="projects">
            <h2>Projects</h2>
            <div class="card-grid">
                <div class="card">
                    <h3>Project One</h3>
                    <p>A brief description of your first project. Explain what it does and what technologies you used.</p>
                    <a href="#" class="btn">View Project</a>
                </div>
                <div class="card">
                    <h3>Project Two</h3>
                    <p>A brief description of your second project. Highlight the key features and your role in it.</p>
                    <a href="#" class="btn">View Project</a>
                </div>
                <div class="card">
                    <h3>Project Three</h3>
                    <p>A brief description of your third project. Share what you learned and the impact it made.</p>
                    <a href="#" class="btn">View Project</a>
                </div>
            </div>
        </section>

        <section id="contact">
            <h2>Get In Touch</h2>
            <p>I'd love to hear from you! Whether you have a question or just want to say hi, feel free to reach out.</p>
            <div style="margin-top: 2rem;">
                <a href="mailto:your.email@example.com" class="btn">Send Email</a>
                <a href="https://github.com/yourusername" class="btn" style="margin-left: 1rem;">GitHub</a>
            </div>
        </section>
    </div>

    <footer>
        <p>&copy; 2025 Your Name. Built with GitHub Pages.</p>
    </footer>
</body>
</html>
