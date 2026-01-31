import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            include: { subTasks: true },
            orderBy: { createdAt: 'desc' } // or whatever order
        });
        // Transform BigInt/Float if needed, but Prisma generic return should be fine for JSON if simple types.
        // Actually our schema has Float, which is fine in JSON.
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Sync tasks (Replace all)
// Since we have max 5 tasks, full replacement is safe and easy.
app.post('/tasks', async (req, res) => {
    const tasks = req.body; // Expects Task[]

    if (!Array.isArray(tasks)) {
        return res.status(400).json({ error: 'Invalid body, expected array of tasks' });
    }

    try {
        // Transaction to replace everything
        await prisma.$transaction(async (tx) => {
            // 1. Delete all tasks (cascade deletes subtasks)
            await tx.task.deleteMany();

            // 2. Create all new tasks
            for (const task of tasks) {
                await tx.task.create({
                    data: {
                        id: task.id,
                        text: task.text,
                        completed: task.completed,
                        createdAt: task.createdAt,
                        subTasks: {
                            create: task.subTasks?.map((st: any) => ({
                                id: st.id,
                                text: st.text,
                                column: st.column,
                                createdAt: st.createdAt
                            })) || []
                        }
                    }
                });
            }
        });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to sync tasks' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
