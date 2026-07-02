import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Path to the work-gallery.json file
const JSON_FILE_PATH = path.join(__dirname, 'public', 'config', 'work-gallery.json');

app.use(cors());
app.use(express.json());

// Helper function to read projects from the file
async function readProjects() {
  try {
    const data = await fs.readFile(JSON_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading JSON file:', error);
    return [];
  }
}

// Helper function to write projects to the file
async function writeProjects(projects) {
  try {
    // Format JSON with 2-space indentation to keep it clean and human-readable
    await fs.writeFile(JSON_FILE_PATH, JSON.stringify(projects, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing JSON file:', error);
    throw error;
  }
}

// 1. GET /api/projects
app.get('/api/projects', async (req, res) => {
  const projects = await readProjects();
  res.json(projects);
});

// 2. POST /api/projects
app.post('/api/projects', async (req, res) => {
  try {
    const { title, url, category, description, tags } = req.body;
    
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const projects = await readProjects();
    
    // Generate a unique ID (max ID + 1)
    const maxId = projects.reduce((max, p) => (p.id > max ? p.id : max), 0);
    const newId = maxId + 1;
    
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const newProject = {
      id: newId,
      title: title.trim(),
      url: url.trim(),
      category: category || 'Dashboard',
      description: description?.trim() || 'ยังไม่มีรายละเอียด',
      tags: Array.isArray(tags) ? tags : [],
      favorite: false,
      createdAt: now,
      updatedAt: now
    };

    projects.push(newProject);
    await writeProjects(projects);

    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// 3. PUT /api/projects/:id
app.put('/api/projects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, url, category, description, tags, favorite } = req.body;

    const projects = await readProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    
    // Update the project details
    const updatedProject = {
      ...projects[index],
      ...(title !== undefined && { title: title.trim() }),
      ...(url !== undefined && { url: url.trim() }),
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description: description.trim() }),
      ...(tags !== undefined && { tags: Array.isArray(tags) ? tags : [] }),
      ...(favorite !== undefined && { favorite: !!favorite }),
      updatedAt: now
    };

    projects[index] = updatedProject;
    await writeProjects(projects);

    res.json(updatedProject);
  } catch (error) {
    console.error('Error in PUT /api/projects:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// 4. DELETE /api/projects/:id
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const projects = await readProjects();
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const deletedProject = projects.splice(index, 1)[0];
    await writeProjects(projects);

    res.json({ message: 'Project deleted successfully', project: deletedProject });
  } catch (error) {
    console.error('Error in DELETE /api/projects:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Serve built static files from 'dist' in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback for SPA routing if serving dist
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      // If index.html isn't found (e.g. dev mode or not built yet)
      res.status(404).send('Not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Express server is running on port ${PORT}`);
  
  // In development, spawn the Vite dev server automatically
  if (process.env.NODE_ENV !== 'production' && !process.env.NO_VITE) {
    console.log('Starting Vite development server...');
    const viteProcess = spawn('npx', ['vite'], {
      stdio: 'inherit',
      shell: true
    });
    
    viteProcess.on('close', (code) => {
      process.exit(code || 0);
    });
  }
});
