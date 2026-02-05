 // ============================================================================
 // TASK QUEUE - Priority queue with DAG dependency management
 // ============================================================================
 
 import { Task, TaskStatus, DagEdge, TaskHistoryEntry, AcceptanceCriterion, OrchestrationEvent } from '../types';
 import { getEventStore } from '../store/EventStore';
 
 export class TaskQueue {
   private tasks: Map<string, Task> = new Map();
   private dagEdges: DagEdge[] = [];
   private run_id: string;
 
   constructor(run_id: string, initialTasks?: Task[], initialEdges?: DagEdge[]) {
     this.run_id = run_id;
     if (initialTasks) {
       initialTasks.forEach(t => this.tasks.set(t.task_id, t));
     }
     if (initialEdges) {
       this.dagEdges = initialEdges;
     }
   }
 
   private logMutation(
     mutation_type: string,
     task_ids: string[],
     justification: string,
     details: Record<string, unknown>
   ): void {
     getEventStore().append(this.run_id, 'QUEUE_MUTATION', {
       mutation_type,
       task_ids,
       justification,
       details,
     });
   }
 
   addTask(task: Omit<Task, 'task_id' | 'created_at' | 'updated_at' | 'history' | 'iteration_count'>, justification: string): Task {
     const now = new Date().toISOString();
     const newTask: Task = {
       ...task,
       task_id: crypto.randomUUID(),
       created_at: now,
       updated_at: now,
       history: [],
       iteration_count: 0,
     };
 
     this.tasks.set(newTask.task_id, newTask);
     
     // Add dependency edges
     task.dependencies.forEach(depId => {
       this.dagEdges.push({
         from_task_id: depId,
         to_task_id: newTask.task_id,
         type: 'depends_on',
       });
     });
 
     this.logMutation('ADD_TASK', [newTask.task_id], justification, { task: newTask });
     return newTask;
   }
 
   updateTask(task_id: string, updates: Partial<Task>, reason: string): Task | undefined {
     const task = this.tasks.get(task_id);
     if (!task) return undefined;
 
     const now = new Date().toISOString();
     const historyEntries: TaskHistoryEntry[] = [];
 
     // Track changes in history
     Object.entries(updates).forEach(([key, value]) => {
       if (key !== 'history' && key !== 'updated_at') {
         historyEntries.push({
           timestamp: now,
           field: key,
           oldValue: (task as any)[key],
           newValue: value,
           reason,
         });
       }
     });
 
     const updatedTask: Task = {
       ...task,
       ...updates,
       updated_at: now,
       history: [...task.history, ...historyEntries],
     };
 
     this.tasks.set(task_id, updatedTask);
     this.logMutation('UPDATE_TASK', [task_id], reason, { updates });
     return updatedTask;
   }
 
   splitTask(task_id: string, subtasks: Omit<Task, 'task_id' | 'created_at' | 'updated_at' | 'history' | 'iteration_count' | 'parent_task_id'>[], justification: string): Task[] {
     const parentTask = this.tasks.get(task_id);
     if (!parentTask) return [];
 
     // Create subtasks with parent reference
     const createdSubtasks = subtasks.map((subtask, index) => {
       const deps = index === 0 ? parentTask.dependencies : []; // First subtask inherits parent deps
       return this.addTask(
         {
           ...subtask,
           dependencies: deps,
           parent_task_id: task_id,
         },
         `Split from task ${task_id}: ${justification}`
       );
     });
 
     // Link subtasks sequentially if needed
     for (let i = 1; i < createdSubtasks.length; i++) {
       this.addDependency(createdSubtasks[i - 1].task_id, createdSubtasks[i].task_id, 'Sequential subtask execution');
     }
 
     // Cancel original task
     this.updateTask(task_id, { status: 'canceled' }, 'Split into subtasks');
     
     this.logMutation('SPLIT_TASK', [task_id, ...createdSubtasks.map(t => t.task_id)], justification, {
       original_task_id: task_id,
       subtask_ids: createdSubtasks.map(t => t.task_id),
     });
 
     return createdSubtasks;
   }
 
   mergeTasks(task_ids: string[], mergedTask: Omit<Task, 'task_id' | 'created_at' | 'updated_at' | 'history' | 'iteration_count'>, justification: string): Task | undefined {
     const tasks = task_ids.map(id => this.tasks.get(id)).filter(Boolean) as Task[];
     if (tasks.length !== task_ids.length) return undefined;
 
     // Collect all dependencies from merged tasks
     const allDeps = new Set<string>();
     tasks.forEach(t => t.dependencies.forEach(d => allDeps.add(d)));
     // Remove self-references
     task_ids.forEach(id => allDeps.delete(id));
 
     const newTask = this.addTask(
       {
         ...mergedTask,
         dependencies: Array.from(allDeps),
       },
       `Merged from tasks: ${task_ids.join(', ')} - ${justification}`
     );
 
     // Cancel original tasks
     task_ids.forEach(id => {
       this.updateTask(id, { status: 'canceled' }, 'Merged into new task');
     });
 
     this.logMutation('MERGE_TASKS', [...task_ids, newTask.task_id], justification, {
       original_task_ids: task_ids,
       merged_task_id: newTask.task_id,
     });
 
     return newTask;
   }
 
   reprioritize(task_id: string, newPriority: number, justification: string): Task | undefined {
     return this.updateTask(task_id, { priority: Math.max(0, Math.min(100, newPriority)) }, justification);
   }
 
   addDependency(from_task_id: string, to_task_id: string, justification: string): boolean {
     // Check for cycles
     if (this.wouldCreateCycle(from_task_id, to_task_id)) {
       return false;
     }
 
     this.dagEdges.push({
       from_task_id,
       to_task_id,
       type: 'depends_on',
     });
 
     // Update task dependencies
     const task = this.tasks.get(to_task_id);
     if (task && !task.dependencies.includes(from_task_id)) {
       this.updateTask(to_task_id, {
         dependencies: [...task.dependencies, from_task_id],
       }, justification);
     }
 
     this.logMutation('ADD_DEPENDENCY', [from_task_id, to_task_id], justification, {
       from_task_id,
       to_task_id,
     });
 
     return true;
   }
 
   removeDependency(from_task_id: string, to_task_id: string, justification: string): boolean {
     const index = this.dagEdges.findIndex(
       e => e.from_task_id === from_task_id && e.to_task_id === to_task_id
     );
     
     if (index === -1) return false;
 
     this.dagEdges.splice(index, 1);
 
     const task = this.tasks.get(to_task_id);
     if (task) {
       this.updateTask(to_task_id, {
         dependencies: task.dependencies.filter(d => d !== from_task_id),
       }, justification);
     }
 
     this.logMutation('REMOVE_DEPENDENCY', [from_task_id, to_task_id], justification, {
       from_task_id,
       to_task_id,
     });
 
     return true;
   }
 
   private wouldCreateCycle(from_task_id: string, to_task_id: string): boolean {
     // BFS to check if adding this edge creates a cycle
     const visited = new Set<string>();
     const queue = [from_task_id];
 
     while (queue.length > 0) {
       const current = queue.shift()!;
       if (current === to_task_id) {
         return true; // Would create a cycle
       }
       if (visited.has(current)) continue;
       visited.add(current);
 
       // Find all tasks that depend on current
       const dependents = this.dagEdges
         .filter(e => e.to_task_id === current)
         .map(e => e.from_task_id);
       queue.push(...dependents);
     }
 
     return false;
   }
 
   getNextTask(): Task | undefined {
     const ready = this.getReadyTasks();
     if (ready.length === 0) return undefined;
 
     // Sort by priority (highest first), then by creation time (oldest first)
     ready.sort((a, b) => {
       if (b.priority !== a.priority) {
         return b.priority - a.priority;
       }
       return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
     });
 
     return ready[0];
   }
 
   getReadyTasks(): Task[] {
     return Array.from(this.tasks.values()).filter(task => {
       if (task.status !== 'queued') return false;
 
       // Check all dependencies are done
       return task.dependencies.every(depId => {
         const depTask = this.tasks.get(depId);
         return depTask && depTask.status === 'done';
       });
     });
   }
 
   getBlockedTasks(): Task[] {
     return Array.from(this.tasks.values()).filter(task => {
       if (task.status !== 'queued') return false;
 
       // Has unfinished dependencies
       return task.dependencies.some(depId => {
         const depTask = this.tasks.get(depId);
         return !depTask || depTask.status !== 'done';
       });
     });
   }
 
   getTask(task_id: string): Task | undefined {
     return this.tasks.get(task_id);
   }
 
   getAllTasks(): Task[] {
     return Array.from(this.tasks.values());
   }
 
   getTasksByStatus(status: TaskStatus): Task[] {
     return Array.from(this.tasks.values()).filter(t => t.status === status);
   }
 
   getDagEdges(): DagEdge[] {
     return [...this.dagEdges];
   }
 
   getQueueStats(): { total: number; queued: number; active: number; blocked: number; done: number; failed: number; canceled: number } {
     const tasks = Array.from(this.tasks.values());
     return {
       total: tasks.length,
       queued: tasks.filter(t => t.status === 'queued').length,
       active: tasks.filter(t => t.status === 'active').length,
       blocked: tasks.filter(t => t.status === 'blocked').length,
       done: tasks.filter(t => t.status === 'done').length,
       failed: tasks.filter(t => t.status === 'failed').length,
       canceled: tasks.filter(t => t.status === 'canceled').length,
     };
   }
 
   toJSON(): { tasks: Task[]; edges: DagEdge[] } {
     return {
       tasks: this.getAllTasks(),
       edges: this.getDagEdges(),
     };
   }
 
   static fromJSON(run_id: string, data: { tasks: Task[]; edges: DagEdge[] }): TaskQueue {
     return new TaskQueue(run_id, data.tasks, data.edges);
   }
 }